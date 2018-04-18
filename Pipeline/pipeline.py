# import jnius_config
# jnius_config.add_options('-Xmx256m')
from apiproxy import ApiProxy
from logger import AmbarLogger
from parsers.fileparser import FileParser
from parsers.contenttypeanalyzer import ContentTypeAnalyzer
from contentprocessors.autotagger import AutoTagger
from model import AmbarFileContent, AmbarFileMeta
from containerprocessors.archiveprocessor import ArchiveProcessor
from containerprocessors.pstprocessor import PstProcessor
from datetime import datetime
import gc
import io
import sys
import argparse
import os
import time
import hashlib
import pika
import json
import base64
from hashlib import sha256

RABBIT_QUEUE_NAME = 'AMBAR_PIPELINE_QUEUE'
RABBIT_HEARTBEAT = 0
API_CALL_TIMEOUT_SECONDS = 1200
PARSE_TIMEOUT_SECONDS = 1200

parser = argparse.ArgumentParser()
parser.add_argument('-id', default='0')
parser.add_argument('-api_url', default='http://ambar:8081')
parser.add_argument('-rabbit_host', default='amqp://ambar')

ocrPdfSymbolsPerPageThreshold = int(os.getenv('ocrPdfSymbolsPerPageThreshold', 1000))
ocrPdfMaxPageCount = int(os.getenv('ocrPdfSymbolsPerPageThreshold', 5))
preserveOriginals = True if os.getenv('preserveOriginals', 'False') == 'True' else False

args = parser.parse_args()

# instantiating Api proxy
apiProxy = ApiProxy(args.api_url, API_CALL_TIMEOUT_SECONDS)
# instantiating logger
logger = AmbarLogger(apiProxy, args.id)
# instantiating ArchiveProcessor
archiveProcessor = ArchiveProcessor(logger, apiProxy)
# instantiating PstProcessor
pstProcessor = PstProcessor(logger, apiProxy)
# instantiating Parser
fileParser = FileParser(logger, PARSE_TIMEOUT_SECONDS, ocrPdfSymbolsPerPageThreshold, ocrPdfMaxPageCount)
# instantiating AutoTagger
autoTagger = AutoTagger(logger, apiProxy)
# checking whether to preserve originals or not
preserveOriginals = True if preserveOriginals else False

# reporting start
logger.LogMessage('info', 'started')

# connecting to Rabbit
logger.LogMessage(
    'info', 'connecting to Rabbit {0}...'.format(args.rabbit_host))
try:
    rabbitConnection = pika.BlockingConnection(pika.URLParameters(
        '{0}?heartbeat={1}'.format(args.rabbit_host, RABBIT_HEARTBEAT)))
    rabbitChannel = rabbitConnection.channel()
    rabbitChannel.basic_qos(prefetch_count=1, all_channels=True)
    logger.LogMessage('info', 'connected to Rabbit!')
except Exception as e:
    logger.LogMessage('error', 'error initializing connection to Rabbit {0}'.format(repr(e)))
    exit(1)

# starting pipeline
logger.LogMessage('info', 'waiting for messages...')


def ProcessFile(sha, fileId, meta, sourceId):
    try:
        logger.LogMessage('verbose', 'task received {0}'.format(sha))

        fileMeta = AmbarFileMeta.InitFromDictWithId(meta)

        if not fileMeta.initialized:
            logger.LogMessage(
                'error', 'error initializing file meta {0}'.format(fileMeta.message))
            return False

        hasParsedContent = False
        fileContent = {}

        apiResp = apiProxy.GetParsedFileContentFields(sha)

        if not apiResp.Success:
            logger.LogMessage('error', 'error retrieving parsed file content fields {0} {1}'.format(
                fileMeta.full_name, apiResp.message))
            return False

        if not (apiResp.Ok or apiResp.NotFound):
            logger.LogMessage('error', 'error retrieving parsed file content fields {0} {1} {2}'.format(
                fileMeta.full_name, apiResp.code, apiResp.message))
            return False

        if apiResp.Ok:
            hasParsedContent = True
            fileContent = apiResp.payload

        if hasParsedContent:
            apiResp = apiProxy.GetParsedFileContent(sha)

            if not apiResp.Success:
                logger.LogMessage('error', 'error retrieving parsed file content {0} {1}'.format(
                    fileMeta.full_name, apiResp.message))
                return False

            if not (apiResp.Ok or apiResp.NotFound):
                logger.LogMessage('error', 'error retrieving parsed file content {0} {1} {2}'.format(
                    fileMeta.full_name, apiResp.code, apiResp.message))
                return False

            if apiResp.NotFound:
                hasParsedContent = False

            if apiResp.Ok:
                hasParsedContent = True
                fileContent['text'] = apiResp.payload.decode('utf-8', 'ignore')
                logger.LogMessage(
                    'verbose', 'parsed content found {0}'.format(fileMeta.full_name))

        if not hasParsedContent:
            apiResp = apiProxy.GetFileContent(sha)

            if not apiResp.Success:
                logger.LogMessage('error', 'error retrieving file content {0} {1}'.format(
                    fileMeta.full_name, apiResp.message))
                return False

            if apiResp.NotFound:
                logger.LogMessage(
                    'verbose', 'file content not found {0}'.format(fileMeta.full_name))
                return False

            if not apiResp.Ok:
                logger.LogMessage('error', 'error retrieving file content {0} {1} {2}'.format(
                    fileMeta.full_name, apiResp.code, apiResp.message))
                return False

            # file received
            fileData = apiResp.payload
            logger.LogMessage(
                'verbose', 'file content received {0}'.format(fileMeta.full_name))

            # checking received sha with calculated payload sha
            calculatedSha = sha256(fileData).hexdigest()
            if (calculatedSha != sha):
                logger.LogMessage('error', 'calculated sha ({0}) is not equal to received sha ({1}) for {2}'.format(
                    calculatedSha, sha, fileMeta.full_name))
                return False

            # checking if file is archive
            if ContentTypeAnalyzer.IsArchive(fileMeta.short_name):
                archiveProcessor.Process(fileData, fileMeta, sourceId)

            # checking if file is pst
            if ContentTypeAnalyzer.IsPst(fileMeta.short_name):
                pstProcessor.Process(fileData, fileMeta, sourceId)

            # extracting
            logger.LogMessage('verbose', 'parsing {0}'.format(fileMeta.full_name))
            fileParserResp = fileParser.Parse(fileMeta.short_name, fileData)

            if not fileParserResp.success:
                logger.LogMessage('error', 'error parsing {0} {1}'.format(
                    fileMeta.full_name, fileParserResp.message))
                return False

            logger.LogMessage(
                'verbose', 'successfully parsed {0}'.format(fileMeta.full_name))

            # building Ambar File Content
            fileContent = AmbarFileContent.Init(fileParserResp, sys.getsizeof(fileData))

            # submitting thumbnail
            if fileParserResp.thumbnail:
                logger.LogMessage(
                    'verbose', 'submitting thumbnail {0}'.format(fileMeta.full_name))
                apiResp = apiProxy.SubmitThumbnail(
                    sha, fileParserResp.thumbnail[0])

                if not apiResp.Success:
                    logger.LogMessage('error', 'error submitting thumbnail to Api {0} {1}'.format(
                        fileMeta.full_name, apiResp.message))
                    return False

                if not apiResp.Ok:
                    logger.LogMessage('error', 'error submitting thumbnail to Api, unexpected response code {0} {1} {2}'.format(
                        fileMeta.full_name, apiResp.code, apiResp.message))
                    return False

                fileContent.thumb_available = True
                logger.LogMessage('verbose', 'thumbnail submited {0}'.format(fileMeta.full_name))

            # submitting parsed text to Api
            if not  ContentTypeAnalyzer.IsArchive(fileMeta.short_name) and not ContentTypeAnalyzer.IsPst(fileMeta.short_name):
                logger.LogMessage('verbose', 'submitting parsed text {0}'.format(fileMeta.full_name))

                apiResp = apiProxy.SubmitExtractedContent(
                    sha, fileContent.text.encode(encoding='utf_8', errors='ignore'))

                if not apiResp.Success:
                    logger.LogMessage('error', 'error submitting parsed text to Api {0} {1}'.format(
                        fileMeta.full_name, apiResp.message))
                    return False

                if not apiResp.Ok:
                    logger.LogMessage('error', 'error submitting parsed text to Api, unexpected response code {0} {1} {2}'.format(
                        fileMeta.full_name, apiResp.code, apiResp.message))
                    return False

                logger.LogMessage('verbose', 'parsed text submited {0}'.format(fileMeta.full_name))

        # submitting processed file to Api
        logger.LogMessage('verbose', 'submitting parsed content {0}'.format(fileMeta.full_name))

        ambarFile = {}
        ambarFile['content'] = fileContent.Dict if isinstance(fileContent, AmbarFileContent) else fileContent
        ambarFile['meta'] = fileMeta.Dict
        ambarFile['sha256'] = sha
        ambarFile['file_id'] = fileId
        ambarFile['indexed_datetime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]

        apiResp = apiProxy.SubmitProcessedFile(fileId, json.dumps(
            dict(ambarFile)).encode(encoding='utf_8', errors='ignore'))

        if not apiResp.Success:
            logger.LogMessage('error', 'error submitting parsed content to Api {0} {1}'.format(
                fileMeta.full_name, apiResp.message))
            return False

        if not (apiResp.Ok or apiResp.Created):
            logger.LogMessage('error', 'error submitting parsed content to Api, unexpected response code {0} {1} {2}'.format(
                fileMeta.full_name, apiResp.code, apiResp.message))
            return False

        logger.LogMessage(
            'verbose', 'parsed content submited {0}'.format(fileMeta.full_name))

        # removing original file
        if not preserveOriginals:
            apiResp = apiProxy.RemoveFileContent(sha)

            if not apiResp.Success:
                logger.LogMessage('error', 'error removing original file from Ambar for {0} {1}'.format(
                    fileMeta.full_name, apiResp.message))
                return False

            if not (apiResp.Ok or apiResp.NotFound):
                logger.LogMessage('error', 'error removing original file from Ambar for {0}, unexpected response code {1} {2}'.format(
                    fileMeta.full_name, apiResp.code, apiResp.message))
                return False

            if apiResp.Ok:
                logger.LogMessage(
                    'verbose', 'original file removed from Ambar for {0}'.format(fileMeta.full_name))

        ## tags
        apiResp = apiProxy.RemoveAutoTags(fileId)
        if not apiResp.Success:
            logger.LogMessage('error', 'error removing autotags {0} {1}'.format(
                fileMeta.full_name, apiResp.message))
            return False

        if not apiResp.Ok:
            logger.LogMessage('error', 'error removing autotags, unexpected response code {0} {1} {2}'.format(
                fileMeta.full_name, apiResp.code, apiResp.message))
            return False

        autoTagger.AutoTagAmbarFile(ambarFile)

        return True
    except Exception as e:
        logger.LogMessage('error', 'error processing task {0} {1}'.format(sha, repr(e)))
        return False

# main callback on receiving message from Rabbit

def RabbitConsumeCallback(channel, method, properties, body):
    bodyObject = json.loads(body.decode('utf-8'))
    sha = bodyObject['sha']
    fileId = bodyObject['fileId']
    meta = bodyObject['meta']
    sourceId = bodyObject['sourceId']
    if (ProcessFile(sha, fileId, meta, sourceId)):
        channel.basic_ack(delivery_tag=method.delivery_tag)
    else:
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    gc.collect()


rabbitChannel.basic_consume(RabbitConsumeCallback, queue=RABBIT_QUEUE_NAME)
rabbitChannel.start_consuming()

exit(0)
