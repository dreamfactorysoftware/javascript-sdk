

(function($) {

    $.extend({

        api: {
            login: function(email, password, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/user/session',
                    data: JSON.stringify({
                        "email": email,
                        "password": password
                    }),
                    cache:false,
                    method:'POST',
                    success:function (response) {
                        callback(response);
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            logout: function(callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/user/session',
                    cache:false,
                    method:'DELETE',
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
                    url: INSTANCE_URL + '/api/v2/user/register?login=true',
                    data: JSON.stringify({
                        "first_name": firstname,
                        "last_name": lastname,
                        "email": email,
                        "new_password": password
                    }),
                    cache:false,
                    method:'POST',
                    success:function (response) {
                        callback(response);
                    },
                    error:function (response) {
                        callback(response);
                        return false;
                    }
                });
            },

            getRecords: function(table, params, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/db/_table/' + table,
                    data: params,
                    cache:false,
                    method:'GET',
                    headers: {
                        "X-DreamFactory-API-Key": APP_API_KEY,
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

            setRecord: function(table, params, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/db/_table/' + table,
                    data: params,
                    cache:false,
                    method:'POST',
                    headers: {
                        "X-DreamFactory-API-Key": APP_API_KEY,
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

            updateRecord: function(table, params, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/db/_table/' + table,
                    data: params,
                    cache:false,
                    method:'PATCH',
                    headers: {
                        "X-DreamFactory-API-Key": APP_API_KEY,
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

            deleteRecord: function(table, params, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/db/_table/' + table + '?' + params,
                    //data: params,
                    cache:false,
                    method:'DELETE',
                    headers: {
                        "X-DreamFactory-API-Key": APP_API_KEY,
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

            replaceRecord: function(table, params, token, callback) {
                $.ajax({
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: INSTANCE_URL + '/api/v2/db/_table/' + table,
                    data: params,
                    cache: false,
                    method: 'PUT',
                    headers: {
                        "X-DreamFactory-API-Key": APP_API_KEY,
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

}(jQuery));

