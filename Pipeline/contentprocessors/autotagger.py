from model import AmbarTaggingRule
from apiproxy import ApiProxy
from logger import AmbarLogger
from parsers.contenttypeanalyzer import ContentTypeAnalyzer
import re

class AutoTagger:
    def __init__(self, Logger, ApiProxy):
        self.logger = Logger
        self.apiProxy = ApiProxy
        self.AUTO_TAG_TYPE = 'auto'
        self.SOURCE_TAG_TYPE = 'source'
    
    def AutoTagAmbarFile(self, AmbarFile):
        self.SetOCRTag(AmbarFile)
        self.SetSourceIdTag(AmbarFile)
        self.SetArchiveTag(AmbarFile)
        self.SetImageTag(AmbarFile)

        for rule in self.GetTaggingRules():
            self.ProcessTaggingRule(rule, AmbarFile)

    def ProcessTaggingRule(self, TaggingRuleToProcess, AmbarFile):
        try:
            if TaggingRuleToProcess.field == 'content':
                match = re.search(TaggingRuleToProcess.regex, AmbarFile['content']['text'])
            elif TaggingRuleToProcess.field == 'path':
                match = re.search(TaggingRuleToProcess.regex, AmbarFile['meta']['full_name'])
            else:
                self.logger.LogMessage('error', 'error applying autotagging rule {0}, no such field known {1}'.format(TaggingRuleToProcess.name, TaggingRuleToProcess.field))
                return

            if match:
                for tag in TaggingRuleToProcess.tags:
                    self.AddTagToAmbarFile(AmbarFile['file_id'], AmbarFile['meta']['full_name'], self.AUTO_TAG_TYPE, tag)
        except Exception as ex:
            self.logger.LogMessage('error', 'error applying autotagging rule {0} to {1} {2}'.format(TaggingRuleToProcess.name, AmbarFile['meta']['full_name'], str(ex)))

    def GetTaggingRules(self):
        taggingRules = []

        apiResp = self.apiProxy.GetTaggingRules()

        if not apiResp.Success: 
            self.logger.LogMessage('error', 'error retrieving autotagging rules {0}'.format(apiResp.message))
            return taggingRules
        
        if not (apiResp.Ok):
            self.logger.LogMessage('error', 'error retrieving autotagging rules, unexpected response code {0} {1}'.format(apiResp.code, apiResp.message))
            return taggingRules

        for ruleDict in apiResp.payload:
            taggingRules.append(AmbarTaggingRule.Init(ruleDict))

        return taggingRules
    
    def SetSourceIdTag(self, AmbarFile):
        self.AddTagToAmbarFile(AmbarFile['file_id'], AmbarFile['meta']['full_name'] ,self.SOURCE_TAG_TYPE, AmbarFile['meta']['source_id'])        

    def SetOCRTag(self, AmbarFile):
        if AmbarFile['content']['ocr_performed']:
            self.AddTagToAmbarFile(AmbarFile['file_id'], AmbarFile['meta']['full_name'], self.AUTO_TAG_TYPE, 'ocr')

    def SetArchiveTag(self, AmbarFile):
        if ContentTypeAnalyzer.IsArchive(AmbarFile['meta']['full_name']):
            self.AddTagToAmbarFile(AmbarFile['file_id'], AmbarFile['meta']['full_name'], self.AUTO_TAG_TYPE, 'archive')

    def SetImageTag(self, AmbarFile):
        if ContentTypeAnalyzer.IsImageByContentType(AmbarFile['content']['type']):
            self.AddTagToAmbarFile(AmbarFile['file_id'], AmbarFile['meta']['full_name'], self.AUTO_TAG_TYPE, 'image')

    def AddTagToAmbarFile(self, FileId, FullName, TagType, Tag):
        apiResp = self.apiProxy.AddFileTag(FileId, TagType, Tag)

        if not apiResp.Success: 
            self.logger.LogMessage('error', 'error adding {0} tag to file {1} {2}'.format(Tag, FullName, apiResp.message))
            return False
        
        if not (apiResp.Ok or apiResp.Created):
            self.logger.LogMessage('error', 'error adding {0} tag to file, unexpected response code {1} {2} {3}'.format(Tag, FullName, apiResp.code, apiResp.message))
            return False
        
        self.logger.LogMessage('verbose', '{0} tag added to {1}'.format(Tag, FullName))

