# Ambar Web API v1.2.0

Ambar Web API documentation

- [Files](#files)
	- [Get File Meta by File Id](#get-file-meta-by-file-id)
	- [Get File Source by File Id](#get-file-source-by-file-id)
	- [Get Parsed Text From File by File Id](#get-parsed-text-from-file-by-file-id)
	- [Download File Content by Secure Uri](#download-file-content-by-secure-uri)
	- [Download Parsed Text by Secure Uri](#download-parsed-text-by-secure-uri)
	- [Upload File](#upload-file)
	- [Hide File](#hide-file)
	- [Unhide File](#unhide-file)
	
- [Search](#search)
	- [Search For Documents By Query](#search-for-documents-by-query)
	- [Retrieve File Highlight by Query and fileId](#retrieve-file-highlight-by-query-and-fileid)
	- [Retrieve Full File Highlight by Query and fileId](#retrieve-full-file-highlight-by-query-and-fileid)
	
- [Sources](#sources)
	- [Get Available Sources](#get-available-sources)
	
- [Statistics](#statistics)
	- [Get Statistics](#get-statistics)
	
- [Tags](#tags)
	- [Delete Tag From File](#delete-tag-from-file)
	- [Get Tags](#get-tags)
	- [Add Tag For File](#add-tag-for-file)
	
- [Thumbnails](#thumbnails)
	- [Get Thumbnail by Id](#get-thumbnail-by-id)
	- [Add or Update Thumbnail](#add-or-update-thumbnail)
	
- [Users](#users)
	- [Login](#login)
	- [Logout](#logout)
	


# Files

## Get File Meta by File Id



	GET api/files/direct/:fileId/meta

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK     

```
Octet-Stream
```
### Error Response

HTTP/1.1 404 Not Found

```
File meta or content not found
```
## Get File Source by File Id



	GET api/files/direct/:fileId/source

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK     

```
Octet-Stream
```
### Error Response

HTTP/1.1 404 Not Found

```
File meta or content not found
```
## Get Parsed Text From File by File Id



	GET api/files/direct/:fileId/text

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK     

```
Octet-Stream
```
### Error Response

HTTP/1.1 404 Not Found

```
File meta or content not found
```
## Download File Content by Secure Uri



	GET api/files/:uri


### Success Response

HTTP/1.1 200 OK     

```
Octet-Stream
```
### Error Response

HTTP/1.1 404 Not Found

```
File meta or content not found
```
## Download Parsed Text by Secure Uri



	GET api/files/:uri/text


### Success Response

HTTP/1.1 200 OK     

```
Octet-Stream
```
### Error Response

HTTP/1.1 404 Not Found

```
File meta or content not found
```
## Upload File

<p>New source named <code>uiupload</code> with description <code>Automatically created on UI upload</code> will be created if source didn't exist.</p>

	POST api/files/uiupload/:filename

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Examples

Upload File test.txt

```
curl -X POST \
http://ambar_api_address/api/files/uiupload/test.txt \
-H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \  
-F file=@test.txt
```

### Success Response

HTTP/1.1 200 OK     

```
{ "fileId": xxxxx }
```
### Error Response

HTTP/1.1 400 Bad Request

```
Wrong request data
```
HTTP/1.1 404 Not Found

```
File meta or content not found
```
## Hide File

<p>Hide file by file id</p>

	PUT api/files/hide/:fileId

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK     

```
HTTP/1.1 200 OK
```
### Error Response

HTTP/1.1 404 NotFound

```
File not found
```
## Unhide File

<p>Unhide file by file id</p>

	PUT api/files/unhide/:fileId

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK     

```
HTTP/1.1 200 OK
```
### Error Response

HTTP/1.1 404 NotFound

```
File not found
```
# Search

## Search For Documents By Query



	GET api/search

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email.</p>							|
| ambar-email-token			| String			|  <p>User token.</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| query			| String			|  <p>URI_ENCODED query string. Check details of query syntax <a href="https://blog.ambar.cloud/mastering-ambar-search-queries/">here</a>.</p>							|
| page			| Number			| **optional** <p>page to return</p>							|
| size			| Number			| **optional** <p>number of results to return per page. Maximum is 100.</p>							|

### Examples

Search For `John`

```
curl -i http://ambar_api_address/api/search?query=John
```

### Success Response

HTTP/1.1 200 OK

```

{  
   "total":1,
   "hits":[  
      {  
         "sha256":"60a777c59176e98efee98bf16b67983dc981ec4da3eaafcb4d79046d005456f9",
         "meta":{  
            "id":"ac8965ab5e07582e0e57cde0e7c4c2d49b955f8b26c779903191893fcb942fa4",
            "full_name":"//mail.nic.ru/hello@ambar.cloud/linus torvalds talk of tech innovation is bullshit shut up and get the work done fcc chairman wants it to be easier to listen to free fm radio on your smartphone.eml",
            "short_name":"linus torvalds talk of tech innovation is bullshit shut up and get the work done fcc chairman wants it to be easier to listen to free fm radio on your smartphone.eml",
            "extension":".eml",
            "extra":[  
            ],
            "source_id":"AmbarEmail",
            "created_datetime":"2017-02-17 09:22:44.000",
            "updated_datetime":"2017-02-17 09:22:44.000",
            "download_uri":"b41c4aaa2999ce42957f087db8e7608970efcedb1eaa40c28336390ecb5373849c955f395258f3dfd7482d4b84d543cdfc23cff8df311276a5e111c0504315c60b159cd2fe2cee20c5470789d9d15e4d7e5fb7c2bc60c29bf9a578e47541fb354dcb5109e49ea9019b2d68c3b35e521a418d9c94f0af55dc79c2442188f039c924d0190c72f488ad77647f2a52aaa267"
         },
         "indexed_datetime":"2017-05-31 13:36:40.400",
         "file_id":"aa5e000fd79cfed0e839af7073e1ef135e128408f984b9a8e70e34242b49f01a",
         "content":{  
            "size":49282,
            "author":"Slashdot Headlines <slashdot@newsletters.slashdot.org>",
            "ocr_performed":false,
            "processed_datetime":"2017-05-31 13:36:40.361",
            "length":"",
            "language":"",
            "thumb_available":false,
            "state":"processed",
            "title":"",
            "type":"message/rfc822",
            "highlight":{  
               "text":[  
                  "__________________________________________________________________________<br/>Linus Torvalds: Talk of Tech Innovation is Bullshit. Shut Up and Get the Work Done<br/>http://clicks.slashdot.org/ct.html?ufl=6&rtr=on&s=x8pb08,2qzsp,10sc,d9zf,fh0y,9dml,a0z3<br/><em>Elon Musk</em> Is <em>Really Boring</em><br/>http://clicks.slashdot.org/ct.html?ufl=6&rtr=on&s=x8pb08,2qzsp,10sc,a5s3,9k63,9dml,a0z3<br/>FCC Chairman Wants It To Be Easier To Listen To Free FM Radio On Your Smartphone<br/>http://clicks.slashdot.org/ct.html?ufl=6&rtr=on&s=x8pb08,2qzsp",
                  "self-serving. From a report on The Register: The term of art he used was more blunt: \"The innovation the industry talks about so much is... Read More http://clicks.slashdot.org/ct.html?ufl=6&rtr=on&s=x8pb08,2qzsp,10sc,aiki,d8f2,9dml,a0z3<br/><em>Elon Musk</em> Is <em>Really Boring</em> http://clicks.slashdot.org/ct.html?ufl=6&rtr=on&s=x8pb08,2qzsp,10sc,ezm,35uk,9dml,a0z3<br/>From the boring-company department<br/>Sometimes it is hard to tell if Elon Musk is serious about the things he says. But as for his \"boring\" claims, that's",
                  "email to: unsubscribe-47676@elabs10.com<br/>Slashdot | 1660 Logan Ave. Ste A | San Diego, CA 92113<br/>To view our Privacy Policy: http://clicks.slashdot.org/ct.html?ufl=6&rtr=on&s=x8pb08,2qzsp,10sc,8pii,7uiv,9dml,a0z3<br/><em>Elon Musk</em> Is <em>Really Boring</em> | Lost Winston Churchill Essay Reveals His Thoughts On Alien<br/>Life<br/>All the Power of a Windows 10 PC Right In Your Pocket<br/>As the world gets more advanced, technology is getting",
                  "WiFi and Bluetooth. Plus, with<br/>a wide range of inputs and outputs, you can link with just about any device you want. Learn More!<br/>Linus Torvalds: Talk of Tech Innovation is Bullshit. Shut Up and Get the Work Done <br/><em>Elon Musk</em> Is <em>Really Boring</em> <br/>FCC Chairman Wants It To Be Easier To Listen To Free FM Radio On Your Smartphone <br/>Lost Winston Churchill Essay Reveals His Thoughts On Alien Life <br/>JavaScript Attack Breaks ASLR On 22 CPU Architectures <br/>Ethicists",
                  "of innovation is smug, self-congratulatory, and self-serving. From a report on The Register: The term of art he used was more blunt: \"The innovation the industry talks about so much is...<br/><em>Elon Musk</em> Is <em>Really Boring</em> <br/>From the boring-company department<br/>Sometimes it is hard to tell if Elon Musk is serious about the things he says. But as for his \"boring\" claims, that's really happening. In a wide-range interview with Bloomberg"
               ]
            }
         },
         "tags":[ 
         ],
         "score":1
      }
   ],
   "took":24.672135
}
```
### Error Response

HTTP/1.1 400 BadRequest

```
HTTP/1.1 400 BadRequest
```
## Retrieve File Highlight by Query and fileId

<p>This method is useful for getting higlights of large files &gt; 30 MB</p>

	GET api/search/:fileId

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email.</p>							|
| ambar-email-token			| String			|  <p>User token.</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| fileId			| String			|  <p>file fileId</p>							|
| query			| String			|  <p>query string</p>							|

### Examples

Retrieve Higlights for File with fileId `318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3`

```
curl -i http://ambar:8004/api/search/318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3?query=John
```

### Success Response

HTTP/1.1 200 OK

```
{
  "highlight": {
    "text": [
      "Aesop, by some strange accident it seems to have entirely<br/>disappeared, and to have been lost sight of. His name is<br/>mentioned by Avienus; by Suidas, a celebrated critic, at the<br/>close of the eleventh century, who gives in his lexicon several<br/>isolated verses of his version of the fables; and by <em>John</em><br/>Tzetzes, a grammarian and poet of Constantinople, who lived<br/>during the latter half of the twelfth century. Nevelet, in the<br/>preface to the volume which we have described, points out that<br/>the Fables of Planudes could not be the work of Aesop, as they<br/>contain a reference in two places to \"Holy"
    ]
  }
}
```
### Error Response

HTTP/1.1 400 BadRequest

```
HTTP/1.1 400 BadRequest
```
## Retrieve Full File Highlight by Query and fileId

<p>This method is useful for getting higlights of large files &gt; 30 MB</p>

	GET api/search/:fileId/full

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email.</p>							|
| ambar-email-token			| String			|  <p>User token.</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| fileId			| String			|  <p>file fileId</p>							|
| query			| String			|  <p>query string</p>							|

### Examples

Retrieve Full Higlight for File with fileId `318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3`

```
curl -i http://ambar:8004/api/search/318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3/full?query=John
```

### Success Response

HTTP/1.1 200 OK

```
Aesop, by some strange accident it seems to have entirely<br/>disappeared, and to have been lost sight of. His name is<br/>mentioned by Avienus; by Suidas, a celebrated critic, at the<br/>close of the eleventh century, who gives in his lexicon several<br/>isolated verses of his version of the fables; and by <em>John</em><br/>Tzetzes, a grammarian and poet of Constantinople, who lived<br/>during the latter half of the twelfth century. Nevelet, in the<br/>preface to the volume which we have described, points out that<br/>the Fables of Planudes could not be the work of Aesop, as they<br/>contain a reference in two places to Holy
```
### Error Response

HTTP/1.1 400 BadRequest

```
HTTP/1.1 400 BadRequest
```
# Sources

## Get Available Sources

<p>Get Available Sources (Crawlers Included)</p>

	GET api/sources/

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email.</p>							|
| ambar-email-token			| String			|  <p>User token.</p>							|

### Success Response

HTTP/1.1 200 OK

```
 [
    {
        "id": "Default",
        "description": "Automatically created on UI upload",
        "type": "bucket"
    }, 
    {
        "id": "Books",
        "description": "Books crawler",
        "type": "crawler"
    },
    {
        "id": "Dropbox",
        "description": "Dropbox Crawler",
        "type": "crawler"
    }
]
```
# Statistics

## Get Statistics



	GET api/stats

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK

```
 {
 "contentType": {
   "total": 2,
   "minThreshold": 0.1,
   "data": [
     {
       "name": "application/msword",
       "value": 1,
       "sizeDataInBytes": {
         "count": 1,
         "min": 91681,
         "max": 91681,
         "avg": 91681,
         "sum": 91681
       }
     }      
   ]
 },
 "procRate": {
   "data": [     
     {
       "date": "2017-04-13",
       "default": 0
     },
     {
       "date": "2017-04-14",
       "default": 2
     }
   ],
   "names": [
     "default"
   ]
 },
 "procTotal": {
   "totalCount": 2,
   "sizeDataInBytes": {
     "sum": 147522,
     "avg": 73761,
     "min": 55841,
     "max": 91681
   }
 }
}
```
# Tags

## Delete Tag From File



	DELETE api/tags/:fileId/:tagType/:tagName

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| fileId			| String			|  <p>File Id to delete tag from.</p>							|
| tagType			| String			|  <p>Tag type to delete.</p>							|
| tagName			| String			|  <p>Tag name to delete.</p>							|

### Success Response

HTTP/1.1 200 OK     

```
{  
   "tags":[  
       {  
         "name":"ocr",
         "filesCount":3
      },
      {  
         "name":"test",
         "filesCount":2
      },
      {  
         "name":"pdf",
         "filesCount":1
      }
   ]
}
```
## Get Tags



	GET api/tags/

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Success Response

HTTP/1.1 200 OK     

```
[  
      {  
         "name":"ocr",
         "filesCount":3
      },
      {  
         "name":"test",
         "filesCount":2
      },
      {  
         "name":"pdf",
         "filesCount":1
      }
]
```
## Add Tag For File



	POST api/tags/:fileId/:tagType/:tagName

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| fileId			| String			|  <p>File Id to add tag to.</p>							|
| tagType			| String			|  <p>Tag type to add.</p>							|
| tagName			| String			|  <p>Tag name to add.</p>							|

### Success Response

HTTP/1.1 200 OK     

```
{  
   "tagId":"e9536a83e64ff03617ab0379d835ac7bbf213bafb95cb42907a56e735472d4fc",
   "tags":[  
      {  
         "name":"ocr",
         "filesCount":3
      },
      {  
         "name":"test",
         "filesCount":2
      },
      {  
         "name":"pdf",
         "filesCount":1
      }
   ]
}
```
# Thumbnails

## Get Thumbnail by Id



	GET api/thumbs/:id


### Success Response

HTTP/1.1 200 OK     

```
Octet-Stream
```
### Error Response

HTTP/1.1 404 NotFound

```
HTTP/1.1 404 NotFound
```
## Add or Update Thumbnail



	POST api/thumbs/:id


### Success Response

HTTP/1.1 200 OK     

```
HTTP/1.1 200 OK
```
### Error Response

HTTP/1.1 400 Bad Request

```
Request body is empty
```
# Users

## Login



	POST api/users/login


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>User Email</p>							|
| password			| String			|  <p>User Password</p>							|

### Success Response

HTTP/1.1 200 OK     

```
{  
   "token": "504d44935c2ccefb557fd49636a73239147b3895db2f2f...",
   "ttl": "604800"
}
```
### Error Response

HTTP/1.1 400 BadRequest

```
Bad request
```
HTTP/1.1 404 NotFound

```
User with specified email not found
```
HTTP/1.1 409 Conflict

```
User is not in active state
```
HTTP/1.1 401 Unauthorized

```
Wrong password
```
## Logout



	POST api/users/logout

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| ambar-email			| String			|  <p>User email</p>							|
| ambar-email-token			| String			|  <p>User token</p>							|

### Error Response

HTTP/1.1 401 Unauthorized

```
Unauthorized
```

