$(function () {
    //replace this dsp_url with yours ( leave the /rest/api_docs part )
    var dsp_url = "https://next.cloud.dreamfactory.com/rest/api_docs";
    //replace this app_name with yours
    var app_name = "todoangular";

    //These are are necessary to communicate with the DreamFactory API
    window.authorizations.add("X-DreamFactory-Application-Name", new ApiKeyAuthorization("X-DreamFactory-Application-Name", app_name, "header"));
    window.authorizations.add('Content-Type', new ApiKeyAuthorization('Content-Type', 'application/json', 'header'));

    // Here I grab all the apis available, assigning them to a global df object
    window.df = new SwaggerApi({
        url: dsp_url,
        supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'merge', 'delete'],
        success: function(){

                $.event.trigger({
                    type: "apiReady"
                });

        },
        error: function(){
            console.log("error occurred");
        }

    });
    //attach headers
    window.df.authorizations = window.authorizations;
    window.df.build();
});