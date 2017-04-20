Change log
==========

0.9.1 (2017-04-20)
-------------------

### Important Note

 - Please, before updating your Ambar to this version, update your `ambar.py` script by running `wget -O ambar.py https://static.ambar.cloud/ambar.py && chmod +x ./ambar.py`

### New features
 
 - Introducing **Search as You Type**
 
 ![Search as You Type](https://habrastorage.org/files/e34/e11/2b2/e34e112b2b6849a4b77d2fe542c24d1c.gif)
  
 - Added German language analyzer, use `ambar-de` in `config.json` to enable it
 
 - Added CJK language analyzer, use `ambar-cjk` in `config.json` to enable it
 
 - Added search by document update time. Examples: `when:today` - search for all documents modified today, other options are: *today*, *yesterday*, *thisweek*, *thismonth*, *thisyear*
 
### Bugfixes

 - Minor bugfixes (thanks for your feedback)

0.9.0 (2017-04-14)
-------------------

### New features
 
 - Added search by Author, all available queries are [described here](https://blog.ambar.cloud/mastering-ambar-search-queries/)
 
 - Added Italian language analyzer, use `ambar-it` in `config.json` to enable it
 
 - Added [API documentation](https://github.com/RD17/ambar/blob/master/API_DOC.md) to GitHub, so you can connect Ambar with other systems
 
### Bugfixes

 - Minor bugfixes (thanks for your feedback)
