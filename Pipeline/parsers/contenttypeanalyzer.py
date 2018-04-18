import re

class ContentTypeAnalyzer:

    @classmethod
    def IsImageByContentType(cls, ContentType):
        regex = re.compile(r'^image\/',re.I)
        return regex.match(ContentType)
    
    @classmethod
    def IsPdfByContentType(cls, ContentType): 
        return True if ContentType == 'application/pdf' else False

    @classmethod
    def IsArchive(cls, FileName):      
        regex = re.compile('(\\.zip$)', re.I)  
        return True if regex.search(FileName) else False

    @classmethod
    def IsPst(cls, FileName):      
        regex = re.compile('(\\.pst$)', re.I)  
        return True if regex.search(FileName) else False

    @classmethod
    def IsPdf(cls, FileName): 
        regex = re.compile('(\\.pdf$)', re.I)  
        return True if regex.search(FileName) else False