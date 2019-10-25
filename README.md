[![Version](https://img.shields.io/badge/Version-v2.1.19-brightgreen.svg)](https://ambar.cloud)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/RD17/ambar/blob/master/License.txt)

:mag: Ambar: Document Search Engine
================================

![Ambar Search](https://ambar.cloud/img/search.gif)

Ambar is an open-source document search engine with automated crawling, OCR, tagging and instant full-text search.

Ambar defines a new way to implement a full-text document search into yor workflow:
- Easily deploy Ambar with a single `docker-compose` file
- Perform a Google-like search through your documents and images contents
- Ambar supports all popular document formats, performs OCR if needed
- Tag your documents
- Use a simple REST Api to integrate Ambar into your workflow

## Features

### Search
[Tutorial: Mastering Ambar Search Queries](https://ambar.cloud/blog/2017/03/24/mastering-search-queries/)

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
* Multithread processing

## Installation

**Notice**: Ambar requires Docker to run, it can't run w/o Docker

You can build Docker images by yourself or buy prebuilt Docker images for **$50** [here](https://ambar.cloud/pricing/).

* The installation instruction for prebuilt images can be found [here](https://ambar.cloud/docs/installation/)
* Tutorial on how to build images from scratch will be available soon

If you want to see how Ambar works w/o installing it, try our [live demo](https://app.ambar.cloud/). No signup required.

## Building the images yourself

All of the images required to run Ambar can be built by the user. In general, each image can be built by navigating into the directory of the component in question, performing any compilation steps required, then building the image like so:

```
# From project root
$ cd FrontEnd
$ docker build . -t <image_name>
```

The resulting image can be referred to by the name specified, and run by the containerization tooling of your choice.

In order to use a local Dockerfile with `docker-compose`, simply change the `image` option to `build`, setting the value to the relative path of the directory containing the dockerfile. Then run `docker-compose build` to build the relevant images. For example:

```
# docker-compose.yml from project root, referencing local dockerfiles
pipeline0:
  build: ./Pipeline/
image: chazu/ambar-pipeline
  localcrawler:
    image: ./LocalCrawler/
```

## FAQ
### Is it open-source?
Yes, it's fully open-source.

### Is it free?
Yes, it is forever free and open-source.

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


