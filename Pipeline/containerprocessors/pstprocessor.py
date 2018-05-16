from model import AmbarFileMeta, AmbarFileContent
from datetime import datetime
from hashlib import sha256
from subprocess import call
from os import walk, path
import hashlib
import re
import io

class PstProcessor():
    def __init__(self, Logger, ApiProxy):
        self.logger = Logger
        self.apiProxy = ApiProxy

        self.tempPath = '/pst-temp'
        self.pstFileName = 'archive.pst'

    def CleanUpTemp(self):
        retcode = -1 
        try:
            retcode = call('rm -rf {0}/*'.format(self.tempPath), shell=True)

            if retcode != 0:
                self.logger.LogMessage('info', 'error cleaning temp dir, code: {0}'.format(retcode))
                return False
        except Exception as e:
            self.logger.LogMessage('info', 'error cleaning temp dir')
            return False
        
        return True

    def ExtractPstArchive(self):
        retcode = -1

        cmd = 'readpst -o {0} -D -j 1 -r -tea -u -w -e {0}/{1}'.format(self.tempPath, self.pstFileName)
        
        try:
            retcode = call(cmd, shell=True)

            if retcode != 0:
                self.logger.LogMessage('info', 'error extracting pst, code: {0}'.format(retcode))
                return False
        except Exception as e:
            self.logger.LogMessage('error', 'error extracting pst {0}'.format(repr(e)))
            return False
        
        return True

    def WriteFileData(self, FileData):
        try:
            f = open('{0}/{1}'.format(self.tempPath, self.pstFileName), 'wb')
            f.write(FileData)
            f.close()
        except Exception as e:
            self.logger.LogMessage('error', 'error writing file {0}'.format(repr(e)))
            return False
        
        return True
    
    def ReadFileData(self, FilePath):
        try:
            f = open(FilePath, 'rb')
            fileData = f.read()
            f.close()
            return fileData
        except Exception as e:
            self.logger.LogMessage('error', 'error reading file {0} {1}'.format(FilePath, e))
        
        return None

    def Process(self, FileData, FileMeta, SourceId):
        self.logger.LogMessage('verbose', 'processing pst archive {0}'.format(FileMeta.full_name))

        try:
            if not self.CleanUpTemp():
                return

            if not self.WriteFileData(FileData):
                return

            if not self.ExtractPstArchive():
                return

            for (dirpath, dirnames, filenames) in walk(self.tempPath):
                for fileName in filenames:
                    self.logger.LogMessage('verbose', 'enqueuing file {0} from pst archive {1}'.format(fileName, FileMeta.full_name))

                    fullNameInArchive = '{0}{1}'.format(FileMeta.full_name, path.join(dirpath.replace(self.tempPath,''), fileName))
                    fullNameInFs = path.join(dirpath, fileName)

                    fileData = self.ReadFileData(fullNameInFs)

                    if not fileData:
                        continue

                    sha = sha256(fileData).hexdigest()
                    size = len(fileData)

                    if size == 0:
                        continue

                    # checking content existance
                    apiResp = self.apiProxy.CheckIfParsedAmbarFileContentExists(sha)

                    if not apiResp.Success:
                        self.logger.LogMessage('error', 'error checking content existance {0} {1}'.format(fullNameInArchive, apiResp.message))
                        continue

                    if not (apiResp.Found or apiResp.NotFound):
                        self.logger.LogMessage('error', 'unexpected response on checking content existance {0} {1} {2}'.format(fullNameInArchive, apiResp.code, apiResp.message))
                        continue

                    if apiResp.NotFound:
                        self.logger.LogMessage(
                            'verbose', 'content not found {0}'.format(fullNameInArchive))

                        # creating content
                        createContentApiResp = self.apiProxy.CreateAmbarFileContent(fileData, sha)

                        if not createContentApiResp.Success:
                            self.logger.LogMessage('error', 'error creating content {0} {1}'.format(fullNameInArchive, createContentApiResp.message))
                            continue

                        if not (createContentApiResp.Found or createContentApiResp.Created):
                            self.logger.LogMessage('error', 'unexpected response on create content {0} {1} {2}'.format(fullNameInArchive, createContentApiResp.code, createContentApiResp.message))
                            continue

                        if createContentApiResp.Found:
                            self.logger.LogMessage('verbose', 'content found {0}'.format(fullNameInArchive))

                        if createContentApiResp.Created:
                            self.logger.LogMessage('verbose', 'content created {0}'.format(fullNameInArchive))

                    if apiResp.Found:
                        self.logger.LogMessage('verbose', 'content found {0}'.format(fullNameInArchive))

                    # sending meta back to queue
                    fileMeta = AmbarFileMeta.InitWithoutId(FileMeta.created_datetime, FileMeta.updated_datetime, fileName, fullNameInArchive, FileMeta.source_id, [{'key': 'from_container', 'value': 'true'}])

                    apiResp = self.apiProxy.EnqueueAmbarFileMeta(fileMeta, sha, SourceId)

                    if not apiResp.Success:
                        self.logger.LogMessage('error', 'error adding meta {0} {1}'.format(
                            fileMeta.full_name, apiResp.message))
                        continue

                    if apiResp.BadRequest:
                        self.logger.LogMessage('verbose', 'bad meta, ignoring... {0}'.format(fileMeta.full_name))
                        continue

                    if not apiResp.Ok:
                        self.logger.LogMessage('error', 'unexpected response on adding meta {0} {1} {2}'.format(fileMeta.full_name, apiResp.code, apiResp.message))
                        continue

                    self.logger.LogMessage('verbose', 'meta added {0}'.format(fileMeta.full_name))

            self.CleanUpTemp()

        except Exception as ex:
            self.logger.LogMessage(
                'info', 'unable to unpack {0} {1}'.format(FileMeta.full_name, ex))
