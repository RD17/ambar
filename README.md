[![Version](https://img.shields.io/badge/Version-v0.9.5-brightgreen.svg)](https://ambar.cloud)
[![License](https://img.shields.io/badge/License-Fair%20Source%20v0.9-blue.svg)](https://github.com/RD17/ambar/blob/master/License.txt)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/ambar/ambar)

Ambar: Document Search System
================================

If you like Ambar please :star: it!

[Landing Page](https://ambar.cloud) | [Cloud](https://app.ambar.cloud) | [Blog](https://blog.ambar.cloud)

![Ambar](https://habrastorage.org/files/947/a32/de7/947a32de7156478094e3e12c16e8366c.jpg)

## What is Ambar

Ambar is a document search engine with automated crawling, OCR, deduplication and ultra-fast full-text search. Imagine having billion of files in different formats like xls, doc, txt, pdf, ppt, etc..., in any encoding. Ambar securely stores them and gives you an ability to search through their content and metadata in milliseconds. It is very lightweight, simple and intuitive, but yet very fast and powerful in terms of data amount and scaling. All the rocket-science is hidden behind the simple UI.

## Features

### Search
[Tutorial: Mastering Ambar Search Queries](https://blog.ambar.cloud/mastering-ambar-search-queries/)

* Fuzzy Search (John~3)
* Phrase Search ("John Smith")
* Search By Author (author:John)
* Search By File Path (filename:\*.txt)
* Search By Date (when: yesterday, today, lastweek, etc)
* Search By Size (size>1M)
* Search As You Type
* Supported language analyzers (Eng, Rus, Ita, Deu, Fra, Spa, Pl, Nld, CJK, Cn)

### Crawling
* [SMB Crawling](https://blog.ambar.cloud/advanced-ambar-usage-crawling-your-own-shared-folders/)
* [FTP Crawling](https://blog.ambar.cloud/crawling-and-searching-ftp-folder-with-ambar/)
* [Mail Crawling](https://blog.ambar.cloud/crawling-and-searching-email-inbox-with-ambar/)
* [Dropbox Crawling](https://blog.ambar.cloud/how-to-search-through-your-dropbox-files-content/)
* Scheduled Crawling (Cron schedule syntax)
* Files Deduplication

### Content Extraction
* Extract content from large files (>30M)
* ZIP archives
* MS Office documents (Word, Excel, Powerpoint, Visio, Publisher)
* OCR over images
* Email messages with attachments
* Adobe PDF (with OCR)
* OpenOffice documents
* RTF, Plaintext
* HTML / XHTML
* Multithread processing (Only EE)

### General
[Ambar features overview (Vimeo)](https://vimeo.com/202204412)

* Files Preview (with Google Docs View)
* Real-Time Statistics
* Web UI
* [REST API](https://github.com/RD17/ambar/blob/master/API_DOC.md)
* Multiple user accounts (Only EE)

## Installation
### Ambar Cloud
It's full-featured latest Ambar, hosted on our servers. All the accounts and data is secured and carefully stored. You can connect Ambar directly to your Dropbox account and enjoy Ambar powerful search over your Dropbox. Trying Ambar Cloud is a perfect way to get the taste what Ambar is.

 * [Signup](https://app.ambar.cloud/signup)
 * That's it!
 
### Self-Hosted Ambar
Self-Hosted Ambar can be installed as a set of Docker images. Community Edition is available for free. It's a tiny version of Enterprise Edition with limited number of pipelines and crawlers and disabled authentication, though preserving full functionality. Also you can request a trial for Enterprise Edition, drop us an email on hello@ambar.cloud

* [Installation Instructions](https://blog.ambar.cloud/ambar-installation-step-by-step-guide-2/)

Docker images can be found on [Docker Hub](https://hub.docker.com/u/ambar/)

## How it Works

* [Under the Hood](https://blog.ambar.cloud/ambar-under-the-hood/)
* [REST API Documentation](https://github.com/RD17/ambar/blob/master/API_DOC.md)
* [Management Script](https://blog.ambar.cloud/ambar-management-script-full-description/)
* The Source Code is freely available under [Fair Source License 1](https://github.com/RD17/ambar/blob/master/License.txt). ([Frontend](https://github.com/RD17/ambar-frontend), [Crawler](https://github.com/RD17/ambar-crawler), [ElasticSearch](https://github.com/RD17/ambar-es), [Rabbit](https://github.com/RD17/ambar-rabbit), [Mongo](https://github.com/RD17/ambar-mongodb), [Installer](https://github.com/RD17/ambar-install))

## FAQ
### Is it open-source?
Yes, almost every Ambar's module is published on GitHub under [Fair Source License 1](https://github.com/RD17/ambar/blob/master/License.txt)

### Is it free?
Yes, Community Edition is forever free. We will NOT charge a penny from you to use it. Basic cloud account is also forever free.

### Does it perform OCR? 
Yes, it performs OCR on images (jpg, tiff, bmp, etc) and PDF's. OCR is perfomed by well-known open-source library Tesseract. We tuned it to achieve best perfomance and quality on scanned documents. 

### Which languages are supported for OCR?
Supported languages: Eng, Rus, Ita, Deu, Fra, Spa.
If you miss your language, please create an issue on GitHub and we'll add it ASAP.

### Does it support tagging?
Nope, we working on it. As a workaround you can use folders hierarchy as a set of tags.

### What about searching in PDF?
Yes, it can search through any PDF, even badly encoded or with scans inside. We did our best to make search over any kind of pdf document smooth.

### I miss XXX language analyzer. Can you add it?
Yes, please create an issue on GitHub.

### Are you going to add UI localizations?
We're working on it. Be patient.

### What is the maximum file size it can handle?
It's limited by amount of RAM on your machine, typically 500MB. It's an awesome result, as typical document managment systems offer 30MB maximum file size to be processed.  

### What is the difference between Ambar CE and Ambar EE?
Basically Ambar CE is a downscaled Ambar EE. For more details check [this](https://ambar.cloud/#get-invite)

### Can anyone else see my documents?
Nope, check our Privacy Policy.

### I have a problem what should I do?
Submit an issue or chat with us on https://ambar.cloud

## Change Log
[Change Log](https://github.com/RD17/ambar/blob/master/CHANGELOG.md)

## Contributors
- [hartmch](https://github.com/hartmch)
- [bdevelops](https://github.com/bdevelops)

## Privacy Policy
[Privacy Policy](https://github.com/RD17/ambar/blob/master/Privacy%20Policy.md)

## License
[Fair Source 1 License v0.9](https://github.com/RD17/ambar/blob/master/License.txt)

