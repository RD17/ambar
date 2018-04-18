from parsers.tikaparser import TikaParser
from parsers.pdfparser import PDFParser
from parsers.contenttypeanalyzer import ContentTypeAnalyzer

class FileParser:
    def __init__(self, Logger, ParserCallTimeoutSeconds, OcrPdfSymbolsPerPageThreshold, OcrPdfMaxPageCount):
        self.logger = Logger
        self.parserCallTimeoutSeconds = ParserCallTimeoutSeconds
        self.pdfParser = PDFParser(self.logger, OcrPdfSymbolsPerPageThreshold, OcrPdfMaxPageCount, self.parserCallTimeoutSeconds)
        self.tikaParser = TikaParser(self.logger, self.parserCallTimeoutSeconds)
        
    def Parse(self, FileName, FileData):
        if ContentTypeAnalyzer.IsPdf(FileName):
            return self.pdfParser.Parse(FileName, FileData)

        return self.tikaParser.Parse(FileName, FileData)