from jnius import autoclass
import re
import io
from PIL import Image
from parsers.contenttypeanalyzer import ContentTypeAnalyzer
from parsers.ocrproxy import OCRProxy, OCRProxyResponse
from parsers.fileparserresponse import FileParserResponse
from parsers.binarystringparser import BinaryStringParser

class TikaParser:
    def __init__(self, Logger, TikaCallTimeoutSeconds):
        self.logger = Logger
        self.ocrProxy = OCRProxy()
        self.ByteArrayInputStream = autoclass('java.io.ByteArrayInputStream')
        self.Metadata = autoclass('org.apache.tika.metadata.Metadata')
        self.AutoDetectParser = autoclass('org.apache.tika.parser.AutoDetectParser')
        self.BodyContentHandler = autoclass('org.apache.tika.sax.BodyContentHandler')
        self.TikaConfig = autoclass('org.apache.tika.config.TikaConfig')

        self.config = self.TikaConfig('/tika-config.xml')
        self.parser = self.AutoDetectParser(self.config)

    def Parse(self, FileName, FileData):
        resp = FileParserResponse()

        try:
            meta = self.Metadata()
            if FileName and FileName != '':
                meta.set(self.Metadata.RESOURCE_NAME_KEY, FileName)
            contentHandler = self.BodyContentHandler(-1)
            inputStream = self.ByteArrayInputStream(FileData)
            self.parser.parse(inputStream, contentHandler, meta)

            try:
                resp.text = contentHandler.toString()
            except Exception as convEx:
                resp.text = BinaryStringParser.Parse(convEx.object)
            
            for name in meta.names():
                try:
                    resp.meta[name] = meta.get(name)
                except:
                    resp.meta[name] = ''

            inputStream = None
            contentHandler = None

            if 'Content-Type' in resp.meta and ContentTypeAnalyzer.IsImageByContentType(resp.meta['Content-Type']):
                self.logger.LogMessage('info','performing ocr on {0}'.format(FileName))
                ocrResp = self.ocrProxy.PerformOCR(FileData)

                if ocrResp.success:
                    resp.text = self.NormalizeText('{0}{1}'.format(resp.text, ocrResp.text))
                    resp.ocrPerformed = True

                if not ocrResp.success:
                    self.logger.LogMessage('info','could not perform ocr on {0} {1}'.format(FileName, ocrResp.message))
                
                resp.thumbnail = self.GenerateThumbnail(FileData)

            resp.success = True
        except Exception as ex:
            resp.success = False
            resp.message = str(ex)

        return resp
    
    def GenerateThumbnail(self, ImageData, MaxWidth = 1000, MaxHeigh = 5000, Quality = 70, Dpi = 50):
        try:              
            image = Image.open(io.BytesIO(ImageData))

            if 'compression' in image.info and image.info['compression']=='tiff_jpeg':
                return None
                
            image.thumbnail((MaxWidth,MaxHeigh))
            bytesIO = io.BytesIO()
            image.convert('RGB').save(bytesIO, format='JPEG', quality=Quality)
            return (bytesIO.getvalue(), 'image/jpeg')
        except:
            pass        
        return None

    def NormalizeText(self, Text):
        regex = re.compile(r'([\s]*[\r]*\n){2,}')
        return re.sub(regex, '\r\n', Text)
