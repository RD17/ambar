from datetime import datetime
from hashlib import sha256
from os import path
import re
import io
import hashlib
import base64
import json

class ExternalNER:
    def __init__(self):
        self.id = ''
        self.uri = ''

    @classmethod
    def Init(cls, Id, Uri):
        eNER = cls()
        eNER.id = Id.lower()
        eNER.uri = Uri.lower()
        return eNER
    
    @classmethod
    def InitFromArray(cls, Array):
        eNERs = []

        for item in Array:
            eNER = cls()
            eNER.id = item
            eNER.uri = item
            eNERs.append(eNER)

        return eNERs

    def __iter__(self):
        yield 'id', self.id
        yield 'uri', self.uri

    @property
    def Dict(self):
        return dict(self)

class AmbarTaggingRule:
    def __init__(self):
        self.field = ''
        self.regex = ''
        self.tags = []
        self.name = ''
        self.enabled = False

    @classmethod
    def Init(cls, TaggingRuleDictionary):
        taggingRule = cls()
        taggingRule.field = TaggingRuleDictionary['field']
        taggingRule.regex = TaggingRuleDictionary['regex']
        taggingRule.tags = TaggingRuleDictionary['tags']
        taggingRule.enabled = TaggingRuleDictionary['enabled']
        taggingRule.name = TaggingRuleDictionary['name']
        return taggingRule

class AmbarLogRecord:
    def __init__(self):
        self.created_datetime = datetime.now()
        self.indexed_datetime = datetime.now()
        self.source_id = ''
        self.type = ''
        self.message = ''

    @classmethod
    def Init(cls, SourceId, Type, Message):
        logRecord = cls()
        logRecord.created_datetime = datetime.now()
        logRecord.indexed_datetime = datetime.now()
        logRecord.source_id = str(SourceId)
        logRecord.type = str(Type)
        logRecord.message = str(Message)
        return logRecord

    def __iter__(self):
        yield 'created_datetime', self.created_datetime.strftime(
            '%Y-%m-%d %H:%M:%S.%f')[:-3]
        yield 'indexed_datetime', self.indexed_datetime.strftime(
            '%Y-%m-%d %H:%M:%S.%f')[:-3]
        yield 'source_id', self.source_id
        yield 'type', self.type
        yield 'message', self.message

    @property
    def Dict(self):
        return dict(self)

class AmbarFileContent:
    def __init__(self):
        self.processed_datetime = ''
        self.size = 0
        self.state = 'new'
        self.title = ''
        self.language = ''
        self.type = ''
        self.author = ''
        self.length = ''
        self.text = ''
        self.thumb_available = False
        self.ocr_performed = False

    @classmethod
    def Init(cls, ParserResponse, FileSize):
        fileContent = cls()
        fileContent.processed_datetime = datetime.now().strftime(
            '%Y-%m-%d %H:%M:%S.%f')[:-3]
        fileContent.size = FileSize
        fileContent.state = 'processed'
        fileContent.title = ParserResponse.meta[
            'title'] if 'title' in ParserResponse.meta else ''
        fileContent.language = ParserResponse.meta[
            'language'] if 'language' in ParserResponse.meta else ''
        fileContent.type = ParserResponse.meta[
            'Content-Type'] if 'Content-Type' in ParserResponse.meta else ''
        fileContent.author = ParserResponse.meta[
            'Author'] if 'Author' in ParserResponse.meta else ''
        fileContent.length = len(ParserResponse.text)
        fileContent.text = ParserResponse.text
        fileContent.ocr_performed = ParserResponse.ocrPerformed
        ## non serializable content
        fileContent.initialized = True
        fileContent.message = 'ok'
        return fileContent

    def __iter__(self):
        yield 'processed_datetime', self.processed_datetime
        yield 'size', self.size
        yield 'state', self.state
        yield 'title', self.title
        yield 'language', self.language
        yield 'type', self.type
        yield 'author', self.author
        yield 'length', self.length
        yield 'text', self.text
        yield 'thumb_available', self.thumb_available
        yield 'ocr_performed', self.ocr_performed

    @property
    def Dict(self):
        return dict(self)

class AmbarFileMeta:
    def __init__(self):
        self.id = ''
        self.full_name = ''
        self.full_name_parts = []
        self.short_name = ''
        self.extension = ''
        self.extra = []
        self.source_id = ''
        self.created_datetime = ''
        self.updated_datetime = ''
        ## non serializable content
        self.initialized = False
        self.message = ''

    @classmethod
    def ParseFullNameIntoParts(cls, FullName):
        fullNameParts = []
        for match in re.finditer(r'/', FullName):
            if match.start() > 1:
                fullNameParts.append(FullName[:match.start() + 1])
        fullNameParts.append(FullName)
        return fullNameParts

    @classmethod
    def Init(cls, MetaDict):
        amFileMeta = cls()
        try:
            amFileMeta.full_name = MetaDict['full_name']
            amFileMeta.full_name_parts = AmbarFileMeta.ParseFullNameIntoParts(MetaDict['full_name'])
            amFileMeta.short_name = MetaDict['short_name']
            amFileMeta.extension = MetaDict['extension']
            amFileMeta.extra = MetaDict['extra']
            amFileMeta.source_id = MetaDict['source_id']
            amFileMeta.created_datetime = MetaDict['created_datetime']
            amFileMeta.updated_datetime = MetaDict['updated_datetime']
            amFileMeta.id = sha256('{0}{1}{2}{3}'.format(MetaDict['source_id'],MetaDict['full_name'],MetaDict['created_datetime'],MetaDict['updated_datetime']).encode('utf-8')).hexdigest()
            ## non serializable content
            amFileMeta.initialized = True
            amFileMeta.message = 'ok'
        except Exception as ex:
            amFileMeta.initialized = False
            amFileMeta.message = str(ex)
        return amFileMeta

    @classmethod
    def InitWithoutId(cls, CreateTime, UpdateTime, ShortName, FullName,
                      AmbarCrawlerId, Extra = []):
        amFileMeta = cls()
        try:
            amFileMeta.full_name = FullName
            amFileMeta.full_name_parts = AmbarFileMeta.ParseFullNameIntoParts(FullName)
            amFileMeta.short_name = ShortName
            amFileMeta.extension = path.splitext(ShortName)[1] if path.splitext(ShortName)[1] != '' else path.splitext(ShortName)[0]
            amFileMeta.extra = Extra
            amFileMeta.source_id = AmbarCrawlerId
            if type(CreateTime) is str:
                amFileMeta.created_datetime = CreateTime
            else:
                amFileMeta.created_datetime = CreateTime.strftime(
                    '%Y-%m-%d %H:%M:%S.%f')[:-3]
            if type(UpdateTime) is str:
                amFileMeta.updated_datetime = UpdateTime
            else:
                amFileMeta.updated_datetime = UpdateTime.strftime(
                    '%Y-%m-%d %H:%M:%S.%f')[:-3]
            ## non serializable content           
            amFileMeta.initialized = True
            amFileMeta.message = 'ok'
        except Exception as ex:
            amFileMeta.initialized = False
            amFileMeta.message = str(ex)
        return amFileMeta

    def __iter__(self):
        yield 'id', self.id
        yield 'full_name', self.full_name
        yield 'full_name_parts', self.full_name_parts
        yield 'short_name', self.short_name
        yield 'extension', self.extension
        extraArr = []
        for extra in self.extra:
            extraArr.append(dict(extra))
        yield 'extra', extraArr
        yield 'source_id', self.source_id
        yield 'created_datetime', self.created_datetime
        yield 'updated_datetime', self.updated_datetime

    @property
    def Dict(self):
        return dict(self)