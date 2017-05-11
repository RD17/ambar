Change log
==========

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
