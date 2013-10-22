window.app = {};
document.addEventListener("apiReady", function(){
    document.getElementById("try-now-get").setAttribute("style", "display:block");
    document.getElementById("get-results").innerHTML = "API Loaded";
    document.getElementById("try-now-post").setAttribute("style", "display:block");
    document.getElementById("post-results").innerHTML = "API Loaded";
    document.getElementById("try-now-delete").setAttribute("style", "display:block");
    document.getElementById("delete-results").innerHTML = "API Loaded";
    document.getElementById("try-now-update").setAttribute("style", "display:block");
    document.getElementById("update-results").innerHTML = "API Loaded";

    window.app.login = function () {
        var body = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };
        window.df.apis.user.login({body: body}, function (response) {
            //assign session token to be used for the session duration
            document.getElementById("login-status").innerHTML = "Logged In"
            window.authorizations.add("X-DreamFactory-Session-Token", new ApiKeyAuthorization("X-Dreamfactory-Session-Token", response.session_id, 'header'));
        }, function(response){
            document.getElementById("login-status").innerHTML = window.app.getErrorString(response);
        });
    };

//after which, you could make a call to the db service, if the current user has access
//if you've enabled a guest user, you can give them access to any resource without auth.

    window.app.getTables = function () {
        window.df.apis.db.getTables(function (response) {
            //Here is your resource list

        });
    };
//get records from a table?  easy.  Just pass the path variable table_name
//A path variable simply gets tacked on to the endpoint, not as a query param.
    window.app.getTodos = function () {
        window.df.apis.db.getRecords({table_name: "todo"}, function (response) {
            //Do something with the data;
           document.getElementById("get-results").innerHTML = JSON.stringify(response);

        }, function(response) {
            document.getElementById("get-results").innerHTML = window.app.getErrorString(response);
        });
    };
//Insert a record
    window.app.addTodo = function () {
        var item = {"record":[{"name":"New Item","complete":false}]};
        window.df.apis.db.createRecords({"table_name":"todo", "body":item}, function(response) {
            document.getElementById("post-results").innerHTML = JSON.stringify(response);
        }, function(response) {
            document.getElementById("post-results").innerHTML = window.app.getErrorString(response);
        });
    };
//Delete a record
    window.app.deleteTodo = function () {
        var id= document.getElementById("delete-id").value;
        window.df.apis.db.deleteRecords({"table_name":"todo", "ids":id}, function(response) {
            document.getElementById("delete-results").innerHTML = JSON.stringify(response);
        }, function(response) {
            document.getElementById("delete-results").innerHTML = window.app.getErrorString(response);
        });
    };
//Update a record
    window.app.updateTodo = function () {
        var id= document.getElementById("update-id").value;
        var complete = true;
        var item = {"record":[{"id":id,"complete":complete}]};
        df.apis.db.updateRecords({"table_name":"todo", "body":item}, function(response) {
            document.getElementById("update-results").innerHTML = JSON.stringify(response);
        }, function(response) {
            document.getElementById("update-results").innerHTML = window.app.getErrorString(response);
        });
    };
    window.app.getErrorString = function(response){
        var msg = "An error occurred, but the server provided no additional information.";
        if (response.content && response.content.data && response.content.data.error) {
            msg = response.content.data.error[0].message;
        }
        msg = msg.replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&apos;/g, '\'');
        return msg;
    };
}, false);


