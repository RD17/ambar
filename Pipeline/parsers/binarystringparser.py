import chardet

class BinaryStringParser:

    @classmethod
    def Parse(cls, BinaryString):
        parsedString = ''
        try:
            detectedEncoding = chardet.detect(BinaryString)
            parsedString = BinaryString.decode(detectedEncoding['encoding'],'ignore')
            return parsedString
        except Exception as ex:
            return parsedString