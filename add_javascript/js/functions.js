

(function($) {

    $.extend({

        api: {
            login: function(email, password) {
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
                        setToken('token', response.session_token);
                        $.redirect('groups');
                    },
                    error:function (response) {
                        alert('Sign in failed! Please check your credentials and try again.')
                        console.log('error');
                        return false;
                    }
                });
            },

            register: function(firstname, lastname, email, password, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: instanceHost + '/api/v2/user/register',
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
                        alert('Register user failed! Please verify the provided information.')
                        console.log('error');
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
                        console.log('error');
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
                        console.log('error');
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
                        console.log('error');
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
                        console.log('error');
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
                        console.log('error');
                    }
                });
            }
        }
    });

}(jQuery));

