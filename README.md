[![Version](https://img.shields.io/badge/Version-v1.3.0-brightgreen.svg)](https://ambar.cloud)
[![License](https://img.shields.io/badge/License-Fair%20Source%20v0.9-blue.svg)](https://github.com/RD17/ambar/blob/master/License.txt)
[![Blog](https://img.shields.io/badge/Ambar%20Blog-%20Latest%20news%20and%20tutorials%20-brightgreen.svg)](https://blog.ambar.cloud)

:mag: Ambar: Document Search System
================================

![Ambar Search](https://ambar.cloud/images/search.gif)

Ambar is an open-source document search and management system with automated crawling, OCR, tagging and instant full-text search.

Ambar defines the new way to manage your documents out of the box:

- Ingest documents from any source
- Find documents and images instantly with Google-like search
- Manage your documents with tags, hide irrelevant search results
- Auto tagging & named entitites recognition

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

* [SMB Crawling](https://blog.ambar.cloud/advanced-ambar-usage-crawling-your-own-shared-folders/)
* [FTP/FTPS Crawling](https://blog.ambar.cloud/crawling-and-searching-ftp-folder-with-ambar/)
* [Mail Crawling](https://blog.ambar.cloud/crawling-and-searching-email-inbox-with-ambar/)
* [Dropbox Crawling](https://blog.ambar.cloud/how-to-search-through-your-dropbox-files-content/)
* Scheduled Crawling (Cron schedule syntax)

### Content Extraction

* Extract content from large files (>30M)
* ZIP archives
* MS Office documents (Word, Excel, Powerpoint, Visio, Publisher)
* OCR over images
* Email messages with attachments
* Adobe PDF (with OCR)
* OCR languages: Eng, Rus, Ita, Deu, Fra, Spa, Pl, Nld
* OpenOffice documents
* RTF, Plaintext
* HTML / XHTML
* Multithread processing (Only EE)

### General

* Files Tagging (Auto tagging as well)
* Named Entitites
* Hiding Irrelevant Search Results
* Files Preview
* Web UI
* [REST API](https://github.com/RD17/ambar/blob/master/API_DOC.md)
* Multiple user accounts (Only EE)

## Editions
There are two editions available: Community and Enterprise. Enterprise Edition is a full featured document search and management system that can handle terabytes of data.

Community Edition is a scaled down, single user version of Enterprise Edition with limited number of pipelines and crawlers, though preserving the full functionality. You are welcome to use Ambar Community Edition for both personal and commercial purposes, at no cost.

## Installation

Installation is straightforward. Turn on your Linux machine and follow our [step-by-step installation guide](https://blog.ambar.cloud/ambar-installation-step-by-step-guide-2/).

*Docker images can be found on [Docker Hub](https://hub.docker.com/u/ambar/)*

## How it Works

* [Under the Hood](https://blog.ambar.cloud/ambar-under-the-hood/)
* [REST API Documentation](https://github.com/RD17/ambar/blob/master/API_DOC.md)
* [Management Script](https://blog.ambar.cloud/ambar-management-script-full-description/)
* The Source Code is freely available under [Fair Source License 1](https://github.com/RD17/ambar/blob/master/License.txt). ([Frontend](https://github.com/RD17/ambar-frontend), [Crawler](https://github.com/RD17/ambar-crawler), [ElasticSearch](https://github.com/RD17/ambar-es), [Rabbit](https://github.com/RD17/ambar-rabbit), [Mongo](https://github.com/RD17/ambar-mongodb), [Installer](https://github.com/RD17/ambar-install))

## FAQ
### Is it open-source?
Yes, almost every Ambar's module is published on GitHub under [Fair Source License 1](https://github.com/RD17/ambar/blob/master/License.txt)

### Is it free?
Yes, Community Edition is forever free. We will NOT charge a penny from you to use it.

### Does it perform OCR? 
Yes, it performs OCR on images (jpg, tiff, bmp, etc) and PDF's. OCR is perfomed by well-known open-source library Tesseract. We tuned it to achieve best perfomance and quality on scanned documents. You can easily find all files on which OCR was perfomed with `tags:ocr` query

### Which languages are supported for OCR?
Supported languages: Eng, Rus, Ita, Deu, Fra, Spa, Pl, Nld.
If you miss your language, please create a new issue and we'll add it ASAP.

### Does it support tagging?
Yes!

### What about searching in PDF?
Yes, it can search through any PDF, even badly encoded or with scans inside. We did our best to make search over any kind of pdf document smooth.

### I miss XXX language analyzer. Can you add it?
Yes, please create an issue on GitHub.

### Are you going to add UI localizations?
As for now there are two options: Russian and English, change `uiLang` in your `config.json`. If you want to add your own localization, please contact us on hello@ambar.cloud. 

### What is the maximum file size it can handle?
It's limited by amount of RAM on your machine, typically 500MB. It's an awesome result, as typical document managment systems offer 30MB maximum file size to be processed.  

### What is the difference between Ambar CE and Ambar EE?
Basically Ambar CE is a downscaled Ambar EE. Check comparison on our [landing page](https://ambar.cloud).

### Can anyone else see my documents?
Nope, check our Privacy Policy.

### I have a problem what should I do?
Submit an issue

## Change Log
[Change Log](https://github.com/RD17/ambar/blob/master/CHANGELOG.md)

## Contributors
- [hartmch](https://github.com/hartmch)
- [bdevelops](https://github.com/bdevelops)

## Privacy Policy
[Privacy Policy](https://github.com/RD17/ambar/blob/master/Privacy%20Policy.md)

## License
[Fair Source 1 License v0.9](https://github.com/RD17/ambar/blob/master/License.txt)

