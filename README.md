[![Version](https://img.shields.io/badge/Version-v2.1.8-brightgreen.svg)](https://ambar.cloud)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/RD17/ambar/blob/master/License.txt)
[![Blog](https://img.shields.io/badge/Ambar%20Blog-%20Latest%20news%20and%20tutorials%20-brightgreen.svg)](https://blog.ambar.cloud)

:mag: Ambar: Document Search Engine
================================

![Ambar Search](https://ambar.cloud/images/search.gif)

Ambar is an open-source document search engine with automated crawling, OCR, tagging and instant full-text search.

Ambar defines the new way to implement a full-text document search into yor workflow:
- Easily deploy Ambar with a single `docker-compose` file
- Perform a Google-like search through your documents and images contents
- Ambar supports all popular document formats, performs OCR if needed
- Tag your documents
- Use a simple REST Api to integrate Ambar into your workflow

## Features

### Search
[Tutorial: Mastering Ambar Search Queries](https://blog.ambar.cloud/mastering-ambar-search-queries/)

* Fuzzy Search (John~3)
* Phrase Search ("John Smith")
* Search By Author (author:John)
* Search By File Path (filename:\*.txt)
* Search By Date (when: yesterday, today, lastweek, etc)
* Search By Size (size>1M)
* Search By Tags (tags:ocr)
* Search As You Type
* Supported language analyzers: English `ambar_en`, Russian `ambar_ru`, German `ambar_de`, Italian `ambar_it`, Polish `ambar_pl`, Chinese `ambar_cn`, CJK `ambar_cjk`

### Crawling

Ambar 2.0 only supports local fs crawling, if you need to crawl an SMB share of an FTP location - just mount it using standard linux tools.
Crawling is automatic, no schedule is needed since the crawler monitors fs events and automatically processes new files.

### Content Extraction

* Ambar supports large files (>30MB)
* ZIP archives
* Mail archives (PST)
* MS Office documents (Word, Excel, Powerpoint, Visio, Publisher)
* OCR over images
* Email messages with attachments
* Adobe PDF (with OCR)
* OCR languages: Eng, Rus, Ita, Deu, Fra, Spa, Pl, Nld
* OpenOffice documents
* RTF, Plaintext
* HTML / XHTML
* Multithread processing (Only EE)

## Installation

Just follow the [installation instruction](https://github.com/RD17/ambar/blob/master/Install.md)

*Docker images can be found on [Docker Hub](https://hub.docker.com/u/ambar/)*

## Support

Ambar is fully open-source and free to use, however you can get a dedicated support from our team for a fee:

- Install & Configure Ambar on your machine - 999$
- Mount external data source - 99$
- Add automatic tagging rule - 299$
- Add password protection to Ambar UI - 299$
- Add custom file extractor - 599$
- Dedicated support - 199$/hour
- Custom features development - 299$/hour

## FAQ
### Is it open-source?
Yes, it's fully open-source now.

### Is it free?
Yes, it is forever free.

### Does it perform OCR? 
Yes, it performs OCR on images (jpg, tiff, bmp, etc) and PDF's. OCR is perfomed by well-known open-source library Tesseract. We tuned it to achieve best perfomance and quality on scanned documents. You can easily find all files on which OCR was perfomed with `tags:ocr` query

### Which languages are supported for OCR?
Supported languages: Eng, Rus, Ita, Deu, Fra, Spa, Pl, Nld.
If you miss your language please contact us on hello@ambar.cloud.

### Does it support tagging?
Yes!

### What about searching in PDF?
Yes, it can search through any PDF, even badly encoded or with scans inside. We did our best to make search over any kind of pdf document smooth.

### What is the maximum file size it can handle?
It's limited by amount of RAM on your machine, typically it's 500MB. It's an awesome result, as typical document managment systems offer 30MB maximum file size to be processed.  

### I have a problem what should I do?
Request a dedicated support session by mailing us on hello@ambar.cloud

## Sponsors

- [IFIC.co.uk](http://www.ific.co.uk/)

## Change Log
[Change Log](https://github.com/RD17/ambar/blob/master/CHANGELOG.md)

## Privacy Policy
[Privacy Policy](https://github.com/RD17/ambar/blob/master/privacy-policy.md)

## License
[MIT License](https://github.com/RD17/ambar/blob/master/license.txt)
