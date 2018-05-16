from model import AmbarFileMeta, AmbarFileContent
from zipfile import ZipFile, ZipInfo
from datetime import datetime
from hashlib import sha256
import hashlib
import re
import io

class ArchiveProcessor():
    def __init__(self, Logger, ApiProxy): 
        self.logger = Logger 
        self.apiProxy = ApiProxy
    
    def Process(self, FileData, FileMeta, SourceId):
        self.logger.LogMessage('verbose','unzipping {0}'.format(FileMeta.full_name))

        try:
            with ZipFile(io.BytesIO(FileData)) as zipFile:
                for zipFileInfo in zipFile.infolist():                    
                    try:
                        unicodeName = zipFileInfo.filename.encode('CP437').decode('CP866')
                    except:
                        unicodeName = zipFileInfo.filename
        
                    fullNameInArchive = '{0}/{1}'.format(FileMeta.full_name, unicodeName)
                    createUpdateTime = datetime(
                        zipFileInfo.date_time[0],
                        zipFileInfo.date_time[1],
                        zipFileInfo.date_time[2],
                        zipFileInfo.date_time[3],
                        zipFileInfo.date_time[4],
                        zipFileInfo.date_time[5])
                    
                    fileData=zipFile.open(zipFileInfo.filename).read()
                    sha = sha256(fileData).hexdigest()
                    size = zipFileInfo.file_size

                    if size == 0:
                        continue

                    ## checking content existance
                    apiResp = self.apiProxy.CheckIfParsedAmbarFileContentExists(sha)

                    if not apiResp.Success: 
                        self.logger.LogMessage('error', 'error checking content existance {0} {1}'.format(fullNameInArchive, apiResp.message))
                        continue

                    if not (apiResp.Found or apiResp.NotFound):
                        self.logger.LogMessage('error', 'unexpected response on checking content existance {0} {1} {2}'.format(fullNameInArchive, apiResp.code, apiResp.message))
                        continue

                    if apiResp.NotFound:
                        self.logger.LogMessage('verbose', 'content not found {0}'.format(fullNameInArchive))            

                        ## creating content
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

                    ## sending meta back to queue
                    fileMeta = AmbarFileMeta.InitWithoutId(createUpdateTime, createUpdateTime, unicodeName, fullNameInArchive, FileMeta.source_id, [{'key': 'from_container', 'value': 'true'}])

                    apiResp = self.apiProxy.EnqueueAmbarFileMeta(fileMeta, sha, SourceId)

                    if not apiResp.Success:
                        self.logger.LogMessage('error', 'error adding meta {0} {1}'.format(fileMeta.full_name, apiResp.message)) 
                        continue
                    
                    if apiResp.BadRequest:
                        self.logger.LogMessage('verbose', 'bad meta, ignoring... {0}'.format(fileMeta.full_name))
                        continue

                    if not apiResp.Ok:
                        self.logger.LogMessage('error', 'unexpected response on adding meta {0} {1} {2}'.format(fileMeta.full_name, apiResp.code, apiResp.message))
                        continue
                    
                    self.logger.LogMessage('verbose', 'meta added {0}'.format(fileMeta.full_name))                       
                       
        except Exception as ex:
            self.logger.LogMessage('info','unable to unpack {0} {1}'.format(FileMeta.full_name, ex))