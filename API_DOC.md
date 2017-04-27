# Ambar Web API v0.9.0

Ambar Web API documentation

- [Files](#files)
	- [Get File Content by Secure Uri](#get-file-content-by-secure-uri)
	- [Upload File](#upload-file)
	
- [Search](#search)
	- [Search For Documents By Query](#search-for-documents-by-query)
	- [Retrieve File Highlight by Query and SHA](#retrieve-file-highlight-by-query-and-sha)
	
- [Sources](#sources)
	- [Get Available Sources](#get-available-sources)
	
- [Statistics](#statistics)
	- [Get Statistics](#get-statistics)
	
- [Thumbnails](#thumbnails)
	- [Get Thumbnail by Id](#get-thumbnail-by-id)
	- [Add or Update Thumbnail](#add-or-update-thumbnail)
	


# Files

## Get File Content by Secure Uri



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
## Upload File

<p>New source with description <code>Automatically created on UI upload</code> will be created if source didn't exist.</p>

	POST api/files/:sourceId/:filename


### Examples

Upload File test.txt

```
curl -X POST \
http://ambar_api_address/api/files/Default/test.txt \
-H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \  
-F file=@test.txt
```

### Success Response

HTTP/1.1 200 OK     

```
HTTP/1.1 200 OK
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
# Search

## Search For Documents By Query



	GET api/search


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
 "total": 1,
 "hits": [    
     {
      "score": 0.5184899160927989,
      "sha256": "318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3",
      "meta": [
          {
          "extension": ".txt",
          "full_name": "//winserver/share/englishstories/aesop11.txt",
          "updated_datetime": "2017-01-13 14:06:20.098",
          "indexed_datetime": "2017-04-03 11:21:10.064",
          "extra": [],
          "short_name": "aesop11.txt",
          "id": "b84b6d7cf88655e9916d5fbb67886b1befa0d00d99f58b62e72fb04b51ff3c31",
          "source_id": "Books",
          "created_datetime": "2017-01-13 14:06:20.026",
          "download_uri": "b41c4aaa2999ce42957f087db8e7608970efcedb1eaa40c28336390ecb5373849c955f395258f3dfd7482d4b84d543cdcc27104c934cd4efdb0ba8c54e6e8e5f3367190091fa4db779fe2097565921e69be43e80068893bafa0dd0b98f90ec96469df54050dee2649b68646824da2cc32061c24a7ed93a6d1514a89a75360551267015c3035515bbb2971a1fcfdf456a"
          }
      ],
      "content": {
          "size": 229353,
          "indexed_datetime": "2017-04-03 11:21:10.163",
          "author": "",
          "processed_datetime": "2017-04-03 11:21:10.163",
          "length": "",
          "language": "",
          "thumb_available": false,
          "state": "processed",
          "title": "",
          "type": "text/plain; charset=windows-1252"
      },
      "highlight": {
          "content.text": [
          "taking no notice of the grain. <br/>The Mule which had been robbed and wounded bewailed his<br/>misfortunes. The other replied, \"I am indeed glad that I was<br/>thought so little of, for I have lost nothing, nor am I hurt with<br/>any wound.\" <br/>The Viper and the File <br/>A LION, entering the workshop of a <em>smith</em>, sought from the tools<br/>the means of satisfying his hunger. He more particularly<br/>addressed himself to a File, and asked of him the favor of a<br/>meal. The File replied, \"You must indeed be a simple-minded<br/>fellow if you expect to get anything from me, who am accustomed<br/>to take from everyone, and",
          "Aesop, by some strange accident it seems to have entirely<br/>disappeared, and to have been lost sight of. His name is<br/>mentioned by Avienus; by Suidas, a celebrated critic, at the<br/>close of the eleventh century, who gives in his lexicon several<br/>isolated verses of his version of the fables; and by <em>John</em><br/>Tzetzes, a grammarian and poet of Constantinople, who lived<br/>during the latter half of the twelfth century. Nevelet, in the<br/>preface to the volume which we have described, points out that<br/>the Fables of Planudes could not be the work of Aesop, as they<br/>contain a reference in two places to \"Holy"
          ]
      }
      }
  ],
  "took": 18.818418
 }
```
### Error Response

HTTP/1.1 400 BadRequest

```
HTTP/1.1 400 BadRequest
```
## Retrieve File Highlight by Query and SHA

<p>This method is useful for getting higlights of large files &gt; 30 MB</p>

	GET api/search/:sha


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| sha			| String			|  <p>file SHA</p>							|
| query			| String			|  <p>query string</p>							|

### Examples

Retrieve Higlights for File with SHA `318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3`

```
curl -i http://ambar:8004/api/search/318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3?query=John
```

### Success Response

HTTP/1.1 200 OK

```
{
  "highlight": {
    "content.text": [
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
# Sources

## Get Available Sources

<p>Get Available Sources (Crawlers Included)</p>

	GET api/sources/


### Success Response

HTTP/1.1 200 OK

```
 [
    {
        "_id": "58dce2754795070012ba2d42",
        "id": "Default",
        "index_name": "d033e22ae348aeb5660fc2140aec35850c4da997",
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

