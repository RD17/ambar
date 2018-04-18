from PIL import Image
import pyocr
import pyocr.builders
import sys
import re
import io

class OCRProxyResponse:
    def __init__(self):
        self.text = ''
        self.success = False
        self.message = ''

class OCRProxy:
    def __init__(self):
        self.ocr = None
        self.lang = None

        for tool in pyocr.get_available_tools():
            if tool.get_name() == 'Tesseract (sh)':
                self.ocr = tool
                break
        
        if self.ocr:
            self.lang = '+'.join(self.ocr.get_available_languages())
    
    def PerformOCR(self, ImageData):
        resp = OCRProxyResponse()

        if not self.ocr:
            resp.success = False
            resp.message = 'No OCR foud!'
            return resp
            
        try:
            image = Image.open(io.BytesIO(ImageData))  
              
            if 'compression' in image.info and image.info['compression']=='tiff_jpeg':
                resp.success = False
                resp.message = 'Unsupported compression type'
                return resp

            text = self.ocr.image_to_string(
                image,
                lang = self.lang,
                builder = pyocr.builders.TextBuilder()
            )            
            resp.text = text
            resp.success = True
        except Exception as ex:
            resp.success = False
            resp.message = str(ex)

        return resp
    
    @classmethod
    def GetLanguages(cls):        
        lang = ''
        for tool in pyocr.get_available_tools():
            if tool.get_name() == 'Tesseract (sh)':
                ocr = tool
                break
        if ocr:
            lang = '+'.join(ocr.get_available_languages())
        return lang