Change log
==========

1.3.0 (2017-11-17)
-------------------

We're happy to announce Ambar 1.3.0 is out!

### What's new:

- We added new ways to visualize your search results: Folders View & Statistics View. Both are live and update as you type your search query.
    - Folders view allows you to quickly navigate through indexed files tree and preview results.
      ![Ambar Folders View](https://habrastorage.org/webt/ma/cq/lj/macqljqn-guhaqaad_ls6hfn2wc.png)
    - Statistics view allows you to easily analyze huge search results and have a full vision of your data
      ![Ambar Statistics View](https://habrastorage.org/webt/ef/27/rr/ef27rrooyilbzemlrlapwtsyws8.png)
 - Many of you asked us to add ui localizations... Thanks to one of our customers who made it possible. As for now there are two options: Russian and English, change `uiLang` in your `config.json`. If you want to add your own localization, please contact us on hello@ambar.cloud. 
 - If you don't want to preserve original files in Ambar, you can disable it in your config.json. Doing this highly reduces Ambar storage space requirements.
 - Ambar management script and config file were optimized. 

### Migration from 1.2.0:
 
Unfortunately, this version is not backwards compatible. So, you have to perform a clean install.

1.2.0 (2017-10-18)
-------------------

Hello everyone!

Ambar 1.2.0 is out! 

### What's new?

- Now you can preview any file in Ambar
- If file contains some sensible data like emails, tax ids, vehicle ids, etc - Ambar recognizes and highlights them. We call this sensible data "named entities".
- You can search by named entities using query `entitites:"hello@ambar.cloud"`
- We added tags coloring depending on tag's type

Before updating your Ambar to this version, you need to reset all the data in your Ambar with `sudo ./ambar.py reset`. After reset run `sudo ./ambar.py update` to get the latest version. 


1.1.0 (2017-09-07)
-------------------

Sunny summer days are over, so we are back to work. 

### New features

#### Tags

 - We completely removed the sources panel from the UI and replaced it with tags
 - Tags panel is on the left sidebar

#### Autotags
 
 - IP, IPv6, IPv4
 - URI, URI-HTTP, URI-HTTPS, URI-FTP
 - Archive, Archive-Zip, Image
 - EMail
 - Phone, Phone-RU

#### Files removing

 - "Hidden Files" are now called "Removed Files". You can search through removed files by show:removed query

#### UI

 - Added Table view for search results. With it you can easily analyze large number of search results and tune your search query

#### Crawlers

 - Added FTPS crawler, just set `type: ftps`

### Bugfixes

 - Added ability to specify IP address and port during Ambar installation
 - Minor bugfixes

### Migration from 1.0.0

 - To update your Ambar to latest version use `sudo ./ambar.py update`

1.0.0 (2017-06-16)
-------------------

It's time for 1.0.0!

### New features

#### Side Panel
 - Introducing side panel: now you can refine your search just by a few clicks. 
 With side panel you can filter documents by time range, source, size or quickly view hidden files
 
 ![Ambar Updated UI](https://habrastorage.org/web/bee/39a/8b7/bee39a8b7c45469e91f0bbc9769ae16c.png)
  
### Bugfixes

 - Fixed igonoring `auth:none` in `config.json` bug (yes, again, sorry)
 - Other minor bug fixes

### Migration from 0.10.0

- To update your Ambar to latest version use `wget -O ambar.py https://static.ambar.cloud/ambar.py && chmod +x ./ambar.py && sudo ./ambar.py update`.

0.10.0 (2017-06-02)
-------------------

### New features

#### Tags:
 - Add tags just by typing them right into a search result with a smart autosuggest. Tags are separated by comma or `Enter` key 
 
 ![Ambar Tags Adding](https://habrastorage.org/web/22b/9c3/0e7/22b9c30e7be14f94983bc46007280aa9.png)

 - Search by one or several tags with `tags:ocr,receipt` query

![Ambar Search By Tag](https://habrastorage.org/web/bd5/a5b/928/bd5a5b928b6f4617a50c249a6799d0c7.png)

 - `ocr` tag is automatically added for ocr-proccessed files, more auto tags are coming soon
  
#### Files removing:

 - Now you can hide irrelevant search results with *Hide* button, so they never display again in your search results 

 ![Hide File Button](https://habrastorage.org/web/7fb/d0b/7d9/7fbd0b7d96ce4d3286f51132ac0bde72.png)
 
 - You can search through hidden files by `show:hidden` query
 
 ![Search Through Hidden Files](https://habrastorage.org/web/02e/351/0d5/02e3510d5e2746faac226aa0dae6a604.png)
 
 - You can restore hidden files with *Restore* button
 
#### UI:
 - Last modified date is now displayed in a human readable format
 - Search result card design was significantly changed
 - Main menu was placed on the right side of the header

### Bugfixes

 - Fixed igonoring `auth:none` in `config.json` bug
 - Other minor bug fixes

### Migration from 0.9.5

 - Before updating your Ambar to this version, you need to reset all the data in your Ambar with `sudo ./ambar.py reset`. After reset run `sudo ./ambar.py update` to get the latest version. 


0.9.5 (2017-05-19)
-------------------

### New features

- Major search improvement. Now search works on all the fields at once, this means if you search for "John" Ambar will search for it in files content, full names, sources and authors. This applies to phrase search and fuzzy search as well
- New API methods added to allow users to use Ambar only as a content extractor (please refer to our [API documentation](https://github.com/RD17/ambar/blob/master/API_DOC.md#files) for further information)
- Chinese language analyzer added, use `ambar_cn` in `config.json` to enable it

### Bugfixes
- Minor UI and WebApi bugfixes (thanks for your feedback)

### Migration from 0.9.4

- Migration to this release requires reset of all your data, as we changed ElasticSearch mappings. Use this migration command: `sudo ./ambar.py reset && sudo ./ambar.py update`


0.9.4 (2017-05-11)
-------------------

### New features
- Added [FTP Crawler](https://blog.ambar.cloud/crawling-and-searching-ftp-folder-with-ambar/)
- Added [Mail Crawler](https://blog.ambar.cloud/crawling-and-searching-email-inbox-with-ambar/)

### Bugfixes
- Minor UI and WebApi bugfixes (thanks for your feedback)

### Migration from 0.9.3

- To update your Ambar to latest version use `wget -O ambar.py https://static.ambar.cloud/ambar.py && chmod +x ./ambar.py && sudo ./ambar.py update`.

0.9.3 (2017-05-04)
-------------------

### New features

- Community Edition now supports authentication. Don't forget to SignUp!
- New module added - Ambar Proxy. Now by default Ambar API and WEB UI use the same 80 port
- Added Polish language analyzer, use `ambar_pl` in `config.json` to enable it
- Internal Ambar networking upgraded that improved stability and performance

### Bugfixes

- Minor UI and WebApi bugfixes (thanks for your feedback)

### Migration from 0.9.2

- Before updating your Ambar to this version, update your `ambar.py` script by running `wget -O ambar.py https://static.ambar.cloud/ambar.py && chmod +x ./ambar.py` and remove `api.internal` & `fe.internal` sections from your `config.json`

0.9.2 (2017-04-27)
-------------------

### New features

- Added avatar for every file type. Click on it to perform search for files with the same extension.

![Avatar for every file type](https://habrastorage.org/files/882/e10/fa2/882e10fa2100416c8a0133ab3a747e47.png)

- Added 'Delete user account' button

![Delete Account](https://habrastorage.org/files/d41/9bb/511/d419bb511da5413fb7415675b716cdd7.png)

- Now you can download extracted text from files ("TEXT" button)
![Text button](https://habrastorage.org/files/d09/c6b/a4f/d09c6ba4f58b4b08b83e9466b772c47f.png)

- Added document preview in Google Viewer. By default this option is disabled as it requires having a public IP address for Ambar. You can preview documents of next formats: doc, docx, ppt, pptx, rtf, txt, xls, xlsx, csv, pdf and sizes less than 3MB. To enable this feature add next lines to your `config.json` file: 
```
"api": {
  .....
  "showFilePreview": "true"
  .....
}
``` 
![Documents preview button](https://habrastorage.org/files/18f/fd0/22e/18ffd022ec8c4ee6a097c9b3e6a0ef8b.png)

- Modified datetime is displayed in human readbale format
![Modified datetime](https://habrastorage.org/files/c71/db7/544/c71db7544d8841368932b316f7c52c24.png)

- Added `reset`(remove all data from Ambar) and `uninstall` actions to `ambar.py` management script

### Bugfixes

 - Minor bugfixes (thanks for your feedback)
 
### Migration from 0.9.1

 - Before updating your Ambar to this version, update your `ambar.py` script by running `wget -O ambar.py https://static.ambar.cloud/ambar.py && chmod +x ./ambar.py`

0.9.1 (2017-04-20)
-------------------

### New features
 
 - Introducing **Search as You Type**
 
 ![Search as You Type](https://habrastorage.org/files/e34/e11/2b2/e34e112b2b6849a4b77d2fe542c24d1c.gif)
  
 - Added German language analyzer, use `ambar_de` in `config.json` to enable it
 
 - Added CJK language analyzer, use `ambar_cjk` in `config.json` to enable it
 
 - Added search by document update time. Examples: `when:today` - search for all documents modified today, other options are: *today*, *yesterday*, *thisweek*, *thismonth*, *thisyear*
 
### Bugfixes

 - Minor bugfixes (thanks for your feedback)
 
### Migration from 0.9.0

 - Before updating your Ambar to this version, update your `ambar.py` script by running `wget -O ambar.py https://static.ambar.cloud/ambar.py && chmod +x ./ambar.py`

0.9.0 (2017-04-14)
-------------------

### New features
 
 - Added search by Author, all available queries are [described here](https://blog.ambar.cloud/mastering-ambar-search-queries/)
 
 - Added Italian language analyzer, use `ambar_it` in `config.json` to enable it
 
 - Added [API documentation](https://github.com/RD17/ambar/blob/master/API_DOC.md) to GitHub, so you can connect Ambar with other systems
 
### Bugfixes

 - Minor bugfixes (thanks for your feedback)
