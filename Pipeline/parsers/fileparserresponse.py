class FileParserResponse:
    def __init__(self):
        self.meta = {}
        self.text = ''
        self.thumbnail = None
        self.success = False
        self.message = ''
        self.ocrPerformed = False