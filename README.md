Address Book for JavaScript
===========================

This repo contains a sample address book application for JavaScript that demonstrates how to use the DreamFactory REST API. It includes new user registration, user login, and CRUD for related tables.

#Getting DreamFactory on your local machine

To download and install DreamFactory, follow the instructions [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/Usage-Options). Alternatively, you can create a [free hosted developer account](http://www.dreamfactory.com) at www.dreamfactory.com if you don't want to install DreamFactory locally.

#Configuring your DreamFactory instance to run the app

- Enable [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for development purposes.
    - In the admin console, navigate to the Config tab and click on CORS in the left sidebar.
    - Click Add.
    - Set Origin, Paths, and Headers to *.
    - Set Max Age to 0.
    - Allow all HTTP verbs and check the Enabled box.
    - Click update when you are done.
    - More info on setting up CORS is available [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/CORs-Configuration).

- Create a default role for new users and enable open registration
    - In the admin console, click the Roles tab then click Create in the left sidebar.
    - Enter a name for the role and check the Active box.
    - Go to the Access tab.
    - Add a new entry under Service Access (you can make it more restrictive later).
        - set Service = All
        - set Component = *
        - check all HTTP verbs under Access
        - set Requester = API
    - Click Create Role.
    - Click the Services tab, then edit the user service. Go to Config and enable Allow Open Registration.
    - Set the Open Reg Role Id to the name of the role you just created.
    - Make sure Open Reg Email Service Id is blank, so that new users can register without email confirmation.
    - Save changes.

- Import the package file for the app.
    - From the Apps tab in the admin console, click Import and click 'Address Book for JavaScript' in the list of sample apps. The Address Book package contains the application description, source code, schemas, and sample data.
    - Leave storage service and folder blank. It will use the default local file service named 'files'.
    - Click the Import button. If successful, your app will appear on the Apps tab. You may have to refresh the page to see your new app in the list.
        
- Decide if you're going to run the app locally or load it from the instance.
    - For running locally you clone the repo to your machine and open index.html in the browser. If running locally you need to set the URL for your instance so the app can make the API calls. Go to your local repo and edit script.js. Set the constant INSTANCE_URL to point to your DreamFactory instance such as http://localhost:8080.
    - For running from the instance you launch the app directly from the Apps tab in the admin console.  Leave INSTANCE_URL set to empty string.

- If running from instance make your app files public.
    - Figure out where your app files are stored. If you used the default storage settings to import the app, it'll be the default local file service named 'files'.
    - Go to the Files tab in the admin console. Find your file service. Double click and find the folder for your app, e.g., 'AddressBookForJavaScript'.
    - Go to the Services tab in the admin console and click the 'files' service. Click the Config tab and add the app folder name 'AddressBookForJavaScript' as a public path. Save your changes.

- Edit your app API key
    - If you are running from instance use the file manager to edit script.js and set APP_API_KEY to the key for your new app. The API key is shown on the app details in the Apps tab of the admin console.
    - If you are running locally edit script.js in your local repo.
    
- Make sure you have a SQL database service named 'db'. Most DreamFactory instances have a default 'db' service for SQLite. You can add one by going to the Services tab in the admin console and creating a new SQL service. Make sure you set the name to 'db'.

#Running the Address Book app

You can launch the app from the Apps tab in the admin console, or by opening your local index.html in your browser.

When the app starts up you can register a new user, or log in as an existing user. Currently the app does not support registering and logging in admin users.

#Example API calls

The DreamFactory Address Book for JavaScript uses AJAX to make API calls and the file `functions.js` contains the most common functions for CRUD operations.

The general form of a DreamFactory REST API call is:

`<rest-verb> http[s]://<server-name>/api/v2/[<service-api-name>]/[<resource-path>][?<param-name>=<param-value>]`

The JavaScript app AJAX call format is:

```javascript
     dataType: String
  contentType: String
          url: String
         data: String,Object
       method: String
      headers: Object
```

Breaking down each parameter:
  - **dataType** Format of the returned data. This depends on the application, but will typically be JSON.
  - **contentType** The format of data sent to the API. This is commonly JSON and char set UTF-8.
  - **url** Holds the value of `http[s]://<server-name>/api/v2/[<service-api-name>]/[<resource-path>]` from the generic call. You can include the query parameters here. However, it is easier and cleaner to pass in the query parameters by using the **data** parameter than it is to format them into the url.
  - **data** The (optional) query parameters.
  - **method** The REST verb.
  - **headers** The header object must include the app specific API key and a session token.

### Examples of log in and registration:

#####Login:
``` javascript
// if the app is imported to the DreamFactory 2.0 instance leave INSTANCE_URL blank. Email and password are typically input fields in the app UI.
var INSTANCE_URL = 'http[s]://<server-name>';
var email         = 'my@email.com';
var password      = 'mypassword';

$.ajax({
   dataType: 'json',
   contentType: 'application/json; charset=utf-8',
   url: INSTANCE_URL + '/api/v2/user/session',
   data: JSON.stringify({
      'email': email,
      'password': password
   }),
   method:'POST',
   success:function (response) {
      // Handle success
   },
   error:function (response) {
      // Handle error
   }
});

```

The `user/session` API request will return a session token.

#####Registration:
``` javascript
// Email and password are typically input fields in the app UI.
var firstname    = 'firstname';
var lastname     = 'lastname';
var email        = 'email';
var new_password = 'new_password';

$.ajax({
   dataType: 'json',
   contentType: 'application/json; charset=utf-8',
   url: INSTANCE_URL + '/api/v2/user/register?login=true',
   data: JSON.stringify({
      'first_name': firstname,
      'last_name': lastname,
      'email': email,
      'new_password': password
   }),
   method:'POST',
   success:function (response) {
      // Handle success
   },
   error:function (response) {
      // Handle error
   }
});
```

The API request will return a session token when the (optional) `login=true` parameter is appended to the url. So with this parameter appended, the new registered user doesn't have to login to get a session token.

The login and registration examples illustrates how to make API requests to DreamFactory 2.0. This Address Book app has functions for common API request types, so in the following examples these functions are used.

### Examples of fetching records

#####all records in table:
``` javascript
// Use the function `getRecords()` function to get all records from the **contact_group** table.
// Usage: getRecords(table, params, token, callback)   -   params can be fields, filters etc.

$.api.getRecords('contact_group', null, session_token, callback);

// create a callback function and handle the returned data there
var callback = function(response) {
    // The response contains an array of group objects
}
```

#####width fields:
``` javascript
// only need to get the contact_id and full contact name
// set the fields param to give us just the fields we need
var params = 'fields=contact_id,first_name,last_name';
$.api.getRecords('contacts', params, session_token, callback);
```

#####width filter:
``` javascript
// create filter to get only the contact ids in the group id 10
// note the equal sign is url encoded (%3D) in the filter value;
var params = 'filter=contact_group_id%3D10';
$.api.getRecords('contact_group_relationship', params, session_token, callback);
```

###Example of creating a record

#####single record:
``` javascript
// Store a group by posting a stringified object. The API request will return the new group id if successful.
var group  = { name: 'My Group' };
var params = JSON.stringify(group);
$.api.setRecord('contact_group', params, session_token, callback);
```

###Example of deleting records

#####with a single id:
``` javascript
// a single record can be deleted by id.
$.api.deleteRecord('contact', null, session_token, callback);
```

#####with multiple ids:
``` javascript
// one or more records from e.g. contact can be deleted by adding one or more ids to the parameter.
var params = ids=1,2,3;
$.api.deleteRecord('contact', params, session_token, callback);
```

#####with fields:
``` javascript
// delete all records matching field conditions, in this case all contacts with the last name 'Smith'.
var params = 'filter=last_name%3DSmith';
$.api.deleteRecord('contact', params, session_token, callback);
```

#Additional Resources

More detailed information on the DreamFactory REST API is available [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/REST-API).

The live API documentation included in the admin console is a great way to learn how the DreamFactory REST API works.
Check out how to use the live API docs [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/API-Docs).
