javascript-sdk
==============

DeamFactory Javascript SDK built with Swagger-JS

Requires version 1.1 of the DreamFactory Platform, set for release September 24th.

You'll need your app_name which is the name of the Application you created on your DSP.
Make sure to set these variables in sdk-init.js: 
```javascript
 //replace this dsp_url with yours ( leave the /rest/api_docs part )
var dsp_url = "https://_your_dsp_hostname_here_/rest/api_docs";
//replace this app_name with yours
var app_name = "your_app_name_here_";
```
Check your API Documentation in the Admin app of your DSP for more info on APIs in the SDK(required params, status codes, etc) 

<a href="http://developers-blog.helloreverb.com/the-fastest-way-to-connect-to-an-api-with-javascript/">Click Here</a> for a primer on using APIs defined for Swagger.
