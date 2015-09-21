

(function($) {

    $.extend({

        api: {
            login: function(email, password) {
                $.ajax({
                    dataType: 'json',
                    url: instanceHost + '/user/session',
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

            getRecords: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    url: instanceHost + '/db/_table/' + table,
                    data: params,
                    cache:false,
                    type:'GET',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success:function (response) {
                        if (response.hasOwnProperty('resource'))
                            callback(response.resource);
                        else
                            callback(response);
                    },
                    error:function (response) {
                        console.log('error');
                    }
                });
            },

            setRecord: function(table, params, apiKey, token, callback) {
                $.ajax({
                    dataType: 'json',
                    url: instanceHost + '/db/_table/' + table,
                    data: params,
                    cache:false,
                    type:'POST',
                    headers: {
                        "X-DreamFactory-API-Key": apiKey,
                        "X-DreamFactory-Session-Token": token
                    },
                    success:function (response) {
                        if (response.hasOwnProperty('resource'))
                            callback(response.resource);
                        else
                            callback(response);
                    },
                    error:function (response) {
                        console.log('error');
                    }
                });
            }
        }
    });

}(jQuery));

