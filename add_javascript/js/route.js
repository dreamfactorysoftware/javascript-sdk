

(function($) {

    $.extend({

        route: function(path) {

            var previousUrl = window.location.hash.slice(1);
            window.location.hash = '#' + path;

            var pathArray = path.split('/');

            $('div[id^="template_"]').hide();
            $('button[id^="menu_"]').hide();

             var routes = [
                 {id: 1,     name: 'index',          regex: '(index)'                           },  // index
                 {id: 2,     name: 'register',       regex: '(register)'                        },  // register
                 {id: 3,     name: 'groups',         regex: '(groups)'                          },  // groups
                 {id: 4,     name: 'group_create',   regex: '(group/create)'                    },  // group/create
                 {id: 5,     name: 'group_show',     regex: '(group).*?(\\d+)'                  },  // group/{:id}
                 {id: 6,     name: 'group_edit',     regex: '(group).*?(\\d+).*?(edit)'         },  // group/{:id}/edit
                 {id: 7,     name: 'contact_create', regex: '(contact).*?\\d+.*?create$'        },  // contact/create/{:group_id}
                 {id: 8,     name: 'contact_show',   regex: '(contact).*?(\\d+)$'               },  // contact/{:id}
                 {id: 9,     name: 'contact_edit',   regex: '(contact).*?(\\d+).*?(edit)'       }   // contact/{:id}/edit
             ];

            var route       = 0;
            var template    = null;

            $.each(routes, function(){
                var test = new RegExp(this.regex);

                if (test.test(path)) {
                    route = this.id;
                    template = this.name;
                }
            });

            //Logout button
            $('#' + template + '_menu_logout').on('click', function () {
                removeToken('token');
            });

            switch (template) {

                case 'index':
                    break;

                case 'register':
                    break;

                case 'groups':
                    setButton('left', template, 'index', 'redirect', null);
                    setButton('plus', template, 'group/create', 'redirect', null);

                    $.api.getRecords('contact_group', null, getToken('token'), populateGroupsTable);
                    break;

                case 'group_show':
                    setButton('left', template, 'groups', 'redirect', null);
                    setButton('plus', template, 'contact/' + pathArray[1] + '/create', 'redirect', null);
                    setButton('right', template, 'group/' + pathArray[1] + '/edit', 'redirect', null);

                    $('#group_show_menu_delete').off().on('click', function(){
                        deleteGroup(pathArray[1]);
                    });

                    var params = 'filter=id%3D' + pathArray[1] + '&fields=name';
                    $.api.getRecords('contact_group', params, getToken('token'), populateGroupShowName);

                    params = 'filter=contact_group_id%3D' + pathArray[1] + '&fields=contact_id';
                    $.api.getRecords('contact_group_relationship', params, getToken('token'), function(data){
                        var contacts = [];
                        $('#table_group').dataTable().fnClearTable();

                        $.each(data, function(id, contact){
                            contacts.push(contact.contact_id);
                        });

                        if(contacts.length) {
                            var params = 'ids=' + contacts.toString();
                            $.api.getRecords('contact', params, getToken('token'), populateGroupTable);
                        }
                    });
                    break;

                case 'group_create':
                    setButton('left', template, 'groups', 'redirect', null);

                    $.api.getRecords('contact', null, getToken('token'), populateGroupCreateTable);
                    break;

                case 'group_edit':
                    setButton('left', template, 'group/' + pathArray[1], 'redirect', null);

                    $('#group_edit_group').val(pathArray[1]);

                    $.api.getRecords('contact_group/' + pathArray[1], null, getToken('token'), populateGroupName);

                    var params = 'filter=contact_group_id%3D' + pathArray[1] + '&fields=contact_id';
                    $.api.getRecords('contact_group_relationship', params, getToken('token'), function(data) {
                        var ids = [];

                        $.each(data, function(index, value) {
                            ids.push(value.contact_id);
                        })

                        $.api.getRecords('contact', null, getToken('token'), function(data) {
                            populateGroupEditTable(data, ids);
                        });
                    });
                    break;

                case 'contact_show':
                    var groupId = $('#contact_edit_group').val();

                    setButton('left', template, 'group/' + groupId, 'redirect', null);
                    setButton('right', template, 'contact/' + pathArray[1] + '/edit', 'redirect', null);

                    $('#contact_show_menu_delete').off().on('click', function(){
                        deleteContact(pathArray[1], previousUrl);
                    });

                    var params = 'filter=contact_id%3D' + pathArray[1];
                    $.api.getRecords('contact/' + pathArray[1], null, getToken('token'), populateContact);
                    $.api.getRecords('contact_info', params, getToken('token'), populateContactInfo);

                    var urlParts = previousUrl.split('/');
                    $('#contact_edit_group').val(urlParts[1]);
                    break;

                case 'contact_create':
                    $('#contact_create_group').val(pathArray[1]);
                    $('#contact_infos').empty();

                    setButton('left', template, previousUrl, 'redirect', null);
                    setButton('cancel', template, previousUrl, 'redirect', null);
                    break;

                case 'contact_edit':
                    $('#contact_infos_edit').empty();

                    setButton('left', template, 'contact/' + pathArray[1], 'redirect', null);
                    setButton('cancel', template, 'contact/' + pathArray[1], 'redirect', null);

                    var params = 'filter=contact_id%3D' + pathArray[1];
                    $.api.getRecords('contact/' + pathArray[1], null, getToken('token'), populateEditContact);
                    $.api.getRecords('contact_info', params, getToken('token'), populateEditContactInfo);
                    break;
            }

            $('#template_' + template).show();
        }
    });


    function setButton(button, page, url, type, func) {
        switch (type) {
            case 'redirect':
                $('#' + page + '_menu_' + button).off().on('click', function(){
                    $.route(url);
                });
                break;
        }
    }



}(jQuery));