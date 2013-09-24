window.app = {};

//to access services that require a session, you'll need to post a body object containing login info in the following format:

window.app.login = function () {
    var body = {
        email: "dspuser@host.com",
        password: "password"
    };
    window.df.apis.user.login({body: JSON.stringify(body)}, function (response) {
        //assign session token to be used for the session duration
        window.authorizations.add("X-DreamFactory-Session-Token", new ApiKeyAuthorization("X-Dreamfactory-Session-Token", response.body.data.session_id, 'header'));
    });
};

//after which, you could make a call to the db service, if the current user has access
//if you've enabled a guest user, you can give them access to any resource without auth.

window.app.getTables = function () {
    window.df.apis.db.getTables(function (response) {
        //console.log(response.body.data.resource);
    });
};
//get records from a table?  easy.  Just pass the path variable table_name
window.app.getTodos = function(){
    window.df.apis.db.getRecords({table_name:"todo"}, function(response)
    {
       console.log(response);
    });
}