window.app = {};

window.addEventListener('apiReady', function(){
    document.getElementById("try-db").setAttribute("style", "display:block");
    document.getElementById("results").innerHTML = "API Loaded";

    window.app.login = function () {
        var body = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };
        window.df.apis.user.login({body: body}, function (response) {
            //assign session token to be used for the session duration
            console.log(response);
            window.authorizations.add("X-DreamFactory-Session-Token", new ApiKeyAuthorization("X-Dreamfactory-Session-Token", response.session_id, 'header'));
        });
    };

//after which, you could make a call to the db service, if the current user has access
//if you've enabled a guest user, you can give them access to any resource without auth.

    window.app.getTables = function () {
        window.df.apis.db.getTables(function (response) {
            //Here is your resource list
            console.log(response.body.data.resource);
        });
    };
//get records from a table?  easy.  Just pass the path variable table_name
//A path variable simply gets tacked on to the endpoint, not as a query param.
    window.app.getTodos = function () {
        window.df.apis.db.getRecords({table_name: "todo"}, function (response) {
            //Do something with the data;
            console.log(response);
            document.getElementById("results").innerHTML = JSON.stringify(response);
        });
    }


});


