from jnius import autoclass
from jnius import cast
from parsers.fileparserresponse import FileParserResponse
from parsers.ocrproxy import OCRProxy, OCRProxyResponse
from parsers.binarystringparser import BinaryStringParser
import io
import sys
import re

class PDFParser:
    def __init__(self, Logger, OcrSymbolsPerPageThreshold, OcrMaxPageCount, ParserCallTimeoutSeconds): 
        self.logger = Logger
        self.ocrProxy = OCRProxy()
        self.parserCallTimeoutSeconds = ParserCallTimeoutSeconds
        self.ocrSymbolsPerPageThreshold = OcrSymbolsPerPageThreshold
        self.ocrMaxPageCount = OcrMaxPageCount
        self.ByteArrayInputStream = autoclass('java.io.ByteArrayInputStream')
        self.ByteArrayOutputStream = autoclass('java.io.ByteArrayOutputStream')
        self.PDDocument = autoclass('org.apache.pdfbox.pdmodel.PDDocument')
        self.PDPage = autoclass('org.apache.pdfbox.pdmodel.PDPage')
        self.PDAnnotation = autoclass('org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotation')
        self.PDDocumentInformation = autoclass('org.apache.pdfbox.pdmodel.PDDocumentInformation')
        self.PDFRenderer = autoclass('org.apache.pdfbox.rendering.PDFRenderer')
        self.PDFTextStripper = autoclass('org.apache.pdfbox.text.PDFTextStripper')
        self.ImageType = autoclass('org.apache.pdfbox.rendering.ImageType')
        self.BufferedImage = autoclass('java.awt.image.BufferedImage')
        self.ImageIO = autoclass('javax.imageio.ImageIO')
        self.MemoryCacheImageOutputStream = autoclass('javax.imageio.stream.MemoryCacheImageOutputStream')
        self.System = autoclass('java.lang.System')   
        self.System.setProperty('org.apache.pdfbox.rendering.UsePureJavaCMYKConversion', 'true')

    def Parse(self, FileName, FileData):
        resp = FileParserResponse()

        try: 
            inputStream = self.ByteArrayInputStream(FileData)
            document = self.PDDocument.load(inputStream)
            metadata = document.getDocumentInformation()
            resp.meta['Author'] = metadata.getAuthor()
            resp.meta['title'] = metadata.getTitle()
            resp.meta['Content-Type'] = 'application/pdf'
            resp.meta['Content-Length'] = sys.getsizeof(FileData)

            if document.getNumberOfPages() == 0:
                resp.success = True
                return resp

            ## generating thumbnail
            resp.thumbnail = self.GenerateThumbnail(document)

            ## parsing text
            pdfStripper = self.PDFTextStripper()

            for pageNumber in range(0, document.getNumberOfPages()):      
                pdfStripper.setStartPage(pageNumber + 1)
                pdfStripper.setEndPage(pageNumber + 1)
                
                try:
                    parsedText = pdfStripper.getText(document)
                except Exception as convEx:
                    parsedText = BinaryStringParser.Parse(convEx.object)

                if ((pageNumber < self.ocrMaxPageCount) or (self.ocrMaxPageCount == -1)) and ((self.GetSymbolsCount(parsedText) < self.ocrSymbolsPerPageThreshold) or (self.ocrSymbolsPerPageThreshold == -1)):
                    self.logger.LogMessage('info','performing ocr on page {0} of pdf {1}'.format(pageNumber + 1, FileName))
                    ocrResp = self.PerformOCROnPage(document, pageNumber)

                    if not ocrResp.success:
                        self.logger.LogMessage('info','could not perform ocr on page {0} of pdf {1} {2}'.format(pageNumber + 1, FileName, ocrResp.message))

                    if ocrResp.success:
                        parsedText = '{0}\r\n{1}'.format(parsedText, ocrResp.text)
                        resp.ocrPerformed = True

                ##parsing annotations
                try:
                    pdfPage = document.getPage(pageNumber)  
                    pdfAnnotations = pdfPage.getAnnotations()

                    annotationsText = ''

                    if pdfAnnotations.size() > 0:
                        for pdfAnnotationNumber in range(0, pdfAnnotations.size()):
                            pdfAnnotationContents = pdfAnnotations.get(pdfAnnotationNumber).getContents()
                            if pdfAnnotationContents and pdfAnnotationContents != '':
                                annotationsText = '{0}{1}\r\n----\r\n'.format(annotationsText, pdfAnnotationContents)
                        
                        if annotationsText != '':
                            parsedText = '{0}\r\n----Annotations start----\r\n{1}----Annotations end----'.format(parsedText, annotationsText[:-6])
                    
                    pdfPage = None
                    pdfAnnotations = None
                except Exception as ex:
                    self.logger.LogMessage('info','could not extract annotations from page {0} of pdf {1}'.format(pageNumber + 1, FileName))

                parsedText = self.NormalizeText(parsedText)
                resp.text = '{0}\r\n{1}'.format(resp.text, parsedText)

            inputStream = None
            document = None
            self.System.gc()

            resp.success = True
        except Exception as ex:
            resp.message = str(ex)
            resp.success = False

        return resp

    def GenerateThumbnail(self, document):
        try:           
            pdfRenderer = self.PDFRenderer(document)
            bufferedImage = pdfRenderer.renderImageWithDPI(0, 75, self.ImageType.RGB)
            byteStream = self.ByteArrayOutputStream()
            imageStream = self.MemoryCacheImageOutputStream(byteStream)
            self.ImageIO.write(bufferedImage, "jpg", imageStream)   
            imageData = bytearray(byteStream.toByteArray())

            pdfRenderer = None
            bufferedImage = None
            byteStream = None
            imageStream = None
            self.System.gc()

            return (imageData, 'image/jpeg')
        except Exception as ex:
            self.logger.LogMessage('info','unable to generate thumbnail for pdf {0}'.format(str(ex)))
            return None 
    
    def PerformOCROnPage(self, document, pageNumber):
        ocrResp = OCRProxyResponse()

        try:
            pdfRenderer = self.PDFRenderer(document)          
            bufferedImage = pdfRenderer.renderImageWithDPI(pageNumber, 200, self.ImageType.RGB)
            byteStream = self.ByteArrayOutputStream()
            imageStream = self.MemoryCacheImageOutputStream(byteStream)
            self.ImageIO.write(bufferedImage, "jpg", imageStream)          
            imageData = bytearray(byteStream.toByteArray())      

            ocrResp = self.ocrProxy.PerformOCR(imageData)

            pdfRenderer = None
            bufferedImage = None
            byteStream = None
            imageStream = None
            self.System.gc()
        except Exception as ex:
            ocrResp.success = False
            ocrResp.message = str(ex)

        return ocrResp

    def NormalizeText(self, Text):
        regex = re.compile(r'([\s]*[\r]*\n){2,}')
        return re.sub(regex, '\r\n', Text)
    
    def GetSymbolsCount(self, Text):
        regex = re.compile(r'[^a-zа-яёй]+', re.I)
        strippedText = re.sub(regex, '', Text)
        return len(strippedText)