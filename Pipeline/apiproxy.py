import io
import re
import requests
import urllib.parse

class ApiProxy:
    def __init__(self, ApiUrl, WebApiUrl, ApiCallTimeoutSeconds):
        self.apiUrl = ApiUrl
        self.webApiUrl = WebApiUrl
        self.apiCallTimeoutSeconds = ApiCallTimeoutSeconds

    def GetTaggingRules(self):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/tags/service/taggingrules'.format(self.apiUrl)
            req = requests.get(apiUri, timeout = self.apiCallTimeoutSeconds)
            if req.status_code == 200:
                try:
                    apiResp.payload = req.json()
                except:
                    apiResp.result = 'error'
                    apiResp.message = str(ex)
            else:
                try:
                    apiResp.message = req.text
                except:
                    pass   
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def IndexLogRecord(self, AmbarLogRecord):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/logs'.format(self.apiUrl)
            req = requests.post(apiUri, json = AmbarLogRecord.Dict, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp
    
    def CheckIfParsedAmbarFileContentExists(self, Sha):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/content/{1}/parsed'.format(self.apiUrl, Sha)
            req = requests.head(apiUri, timeout = self.apiCallTimeoutSeconds)
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp  

    def CheckIfMetaExists(self, Meta):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/meta/exists'.format(self.apiUrl)
            req = requests.post(apiUri, json = Meta, timeout = self.apiCallTimeoutSeconds)
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp 

    def CreateAmbarFileContent(self, FileData, Sha256):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/content/{1}'.format(self.apiUrl, Sha256)
            files = {'file': (Sha256, FileData)}
            req = requests.post(apiUri, files = files, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def RemoveFileContent(self, sha): 
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/content/{1}'.format(self.apiUrl, sha)
            req = requests.delete(apiUri, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def GetFileContent(self, Sha):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/content/{1}'.format(self.apiUrl, Sha)
            req = requests.get(apiUri, timeout = self.apiCallTimeoutSeconds)
            if req.status_code == 200:                
                contentDispositionHeader = req.headers['content-disposition']
                reRes = re.search("filename\*=UTF-8\'\'(.+)", contentDispositionHeader)
                if reRes:
                    apiResp.sha = reRes.group(1)
                apiResp.payload = req.content
            else:
                try:
                    apiResp.message = req.text
                except:
                    pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def HideFile(self, FileId): 
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/hide/{1}'.format(self.webApiUrl, FileId)
            req = requests.put(apiUri, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp
    
    def UnhideFile(self, FileId): 
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/unhide/{1}'.format(self.webApiUrl, FileId)
            req = requests.put(apiUri, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def DownloadFile(self, FullName):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/download?path={1}'.format(self.webApiUrl, urllib.parse.quote_plus(FullName))
            req = requests.get(apiUri, timeout = self.apiCallTimeoutSeconds)
            if req.status_code == 200:                
                apiResp.payload = req.content
            else:
                try:
                    apiResp.message = req.text
                except:
                    pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def DownloadFileBySha(self, Sha):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/download?sha={1}'.format(self.webApiUrl, urllib.parse.quote_plus(Sha))
            req = requests.get(apiUri, timeout = self.apiCallTimeoutSeconds)
            if req.status_code == 200:                
                apiResp.payload = req.content
            else:
                try:
                    apiResp.message = req.text
                except:
                    pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp
    
    def GetParsedFileContent(self, Sha):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/content/{1}/parsed'.format(self.apiUrl, Sha)
            req = requests.get(apiUri, timeout = self.apiCallTimeoutSeconds)
            if req.status_code == 200:                
                contentDispositionHeader = req.headers['content-disposition']
                reRes = re.search("filename\*=UTF-8\'\'(.+)", contentDispositionHeader)
                if reRes:
                    apiResp.sha = reRes.group(1)
                apiResp.payload = req.content
            else:
                try:
                    apiResp.message = req.text
                except:
                    pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp
    
    def GetParsedFileContentFields(self, Sha):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/content/{1}/fields'.format(self.apiUrl, Sha)
            req = requests.get(apiUri, timeout = self.apiCallTimeoutSeconds)  
            if req.status_code == 200:
                try:
                    apiResp.payload = req.json()
                except:
                    apiResp.result = 'error'
                    apiResp.message = str(ex)
            else:
                try:
                    apiResp.message = req.text
                except:
                    pass     
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def EnqueueAmbarFileMeta(self, AmbarFileMeta, Sha, CrawlerId):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/meta/{1}/{2}'.format(self.apiUrl, Sha, CrawlerId)
            req = requests.post(apiUri, json = AmbarFileMeta.Dict, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp
    
    def AddMetaIdToCache(self, MetaId):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/meta/{1}/processed'.format(self.apiUrl, MetaId)
            req = requests.post(apiUri, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def SubmitProcessedFile(self, FileId, AmbarFileBytes):
        apiResp = RestApiResponse()
        try:
            files = {'file': (FileId, AmbarFileBytes)}
            apiUri = '{0}/api/files/file/{1}/processed'.format(self.apiUrl, FileId)
            req = requests.post(apiUri, files=files, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp
    
    def RemoveAutoTags(self, FileId):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/files/autotags/{1}'.format(self.apiUrl, FileId)
            req = requests.delete(apiUri, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def AddFileTag(self, FileId, TagType, TagName):
        apiResp = RestApiResponse()
        try:
            apiUri = '{0}/api/tags/service/{1}/{2}/{3}'.format(self.apiUrl, FileId, TagType, TagName)
            req = requests.post(apiUri, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def SubmitExtractedContent(self, Sha256, AmbarFileContentTextBytes):
        apiResp = RestApiResponse()
        try:
            files = {'file': (Sha256, AmbarFileContentTextBytes)}
            apiUri = '{0}/api/files/content/{1}/extracted'.format(self.apiUrl, Sha256)
            req = requests.post(apiUri, files=files, timeout = self.apiCallTimeoutSeconds)
            try:
                apiResp.message = req.text
            except:
                pass
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

    def SubmitThumbnail(self, ThumbId, ThumbData):
        apiResp = RestApiResponse()
        try:
            files = {'file': (ThumbId, ThumbData)}
            apiUri = '{0}/api/thumbs/{1}'.format(self.apiUrl, ThumbId)
            req = requests.post(apiUri, files=files, timeout = self.apiCallTimeoutSeconds)
            apiResp.result = 'ok'
            apiResp.code = req.status_code            
        except requests.exceptions.RequestException as ex:
            apiResp.result = 'error'
            apiResp.message = str(ex)
        return apiResp

class RestApiResponse:
    def __init__(self):
        self.result = 'ok'
        self.code = 0
        self.payload = None
        self.message = None

    @property
    def Success(self):
        return True if self.result == 'ok' else False 
    @property
    def Error(self):
        return True if self.result == 'error' else False 

    @property
    def Ok(self):
        return True if self.code == 200 else False    
    @property
    def Created(self):
        return True if self.code == 201 else False  
    @property
    def NoContent(self):
        return True if self.code == 204 else False   
    @property
    def Found(self):
        return True if self.code == 302 else False
    @property
    def BadRequest(self):
        return True if self.code == 400 else False
    @property
    def Unauthorized(self):
        return True if self.code == 401 else False
    @property
    def NotFound(self):
        return True if self.code == 404 else False
    @property
    def Conflict(self):
        return True if self.code == 409 else False
    @property
    def InternalServerError(self):
        return True if self.code == 500 else False
    @property
    def InsufficientStorage(self):
        return True if self.code == 507 else False