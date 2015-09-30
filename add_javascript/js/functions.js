

(function($) {

    $.extend({

        api: {
            login: function(email, password, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/user/session',
                    data: JSON.stringify({
                        "email": email,
                        "password": password
                    }),
                    cache:false,
                    type:'POST',
                    success:function (response) {
                        callback(response);
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            register: function(firstname, lastname, email, password, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/user/register?login=true',
                    data: JSON.stringify({
                        "first_name": firstname,
                        "last_name": lastname,
                        "email": email,
                        "new_password": password
                    }),
                    cache:false,
                    type:'POST',
                    success:function (response) {
                        callback(response);
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            getRecords: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/db/_table/' + table,
                    data: params,
                    cache:false,
                    type:'GET',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success:function (response) {
                        if(typeof callback !== 'undefined') {
                            if (response.hasOwnProperty('resource'))
                                callback(response.resource);
                            else
                                callback(response);
                        }
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            setRecord: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/db/_table/' + table,
                    data: params,
                    cache:false,
                    type:'POST',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success:function (response) {
                        if(typeof callback !== 'undefined') {
                            if (response.hasOwnProperty('resource'))
                                callback(response.resource);
                            else
                                callback(response);
                        }
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            updateRecord: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/db/_table/' + table,
                    data: params,
                    cache:false,
                    type:'PATCH',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success:function (response) {
                        if(typeof callback !== 'undefined') {
                            if (response.hasOwnProperty('resource'))
                                callback(response.resource);
                            else
                                callback(response);
                        }
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            deleteRecord: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/db/_table/' + table + '?' + params,
                    //data: params,
                    cache:false,
                    type:'DELETE',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success:function (response) {
                        if(typeof callback !== 'undefined') {
                            if (response.hasOwnProperty('resource'))
                                callback(response.resource);
                            else
                                callback(response);
                        }
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            replaceRecord: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/db/_table/' + table,
                    data: params,
                    cache: false,
                    type: 'PUT',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success: function (response) {
                        if(typeof callback !== 'undefined') {
                            if (response.hasOwnProperty('resource'))
                                callback(response.resource);
                            else
                                callback(response);
                        }
                    },
                    error: function (response) {
                        callback(response);
                        return false;
                    }
                });
            }
        }
    });


    function showMessage(response) {
        var responseObj = jQuery.parseJSON( response.responseText );

        if(responseObj.error.context !== null) {
            var errMsg = '[' + responseObj.error.code + '] ' + responseObj.error.message + '\n\n';

            $.each(responseObj.error.context, function(data){
                errMsg += responseObj.error.context[data][0].replace(/&quot;/g, '\"') + '\n';
            })
            alert(errMsg);
        }
        else {
            alert('[' + responseObj.error.code + '] ' + responseObj.error.message.replace(/&quot;/g, '\"'));
        }
    }


}(jQuery));

