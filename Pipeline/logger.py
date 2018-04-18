from datetime import datetime
from model import AmbarLogRecord
import sys

class AmbarLogger:
    def __init__(self, ApiProxy, Name, Verbose = True):
        """SourceId - crawler id from AmbarCrawlerSettings
        """
        self.apiProxy = ApiProxy
        self.name = Name
        self.verbose = Verbose

    def SendLogMessageToES(self, MessageType, Message):
        apiResp = self.apiProxy.IndexLogRecord(AmbarLogRecord.Init('pipeline', MessageType, '[{0}] {1}'.format(self.name, Message)))
        if not (apiResp.Ok or apiResp.Created):
            print('{0}: [{1}] [{2}] {3} {4}'.format(datetime.now(), 'error', self.name, apiResp.code, apiResp.message), file=sys.stderr)  

    def LogMessage(self, MessageType, Message):
        """Writing message into stdout, stderr and ES (calling WebApi)
        MessageType: verbose, info, error
        All messages are logged into ES
        Error messages are logged into stderr
        Info messages are logged into stdout        
        If in config.json set "Verbose": true then all messages except for errors are logged into stdout    
        """
        if self.verbose or MessageType!='verbose':
            print('{0}: [{1}] [{2}] {3}'.format(datetime.now(), MessageType, self.name, Message), file=(sys.stderr if MessageType == 'error' else sys.stdout)) 
            self.SendLogMessageToES(MessageType, Message)
           