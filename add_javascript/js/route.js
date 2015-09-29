

(function($) {

    $.extend({

        redirect: function(path) {

            var previousUrl = window.location.hash.slice(1);
            window.location.hash = '#' + path;

            var pathArray = path.split('/');

            $('div[id^="template_"]').hide();
            $('button[id^="menu_"]').hide();

             var routes = [
                 {id: 1,     name: 'index',          regex: '(index)'                           },  // index
                 {id: 2,     name: 'groups',         regex: '(groups)'                          },  // groups
                 {id: 3,     name: 'group_create',   regex: '(group/create)'                    },  // group/create
                 {id: 4,     name: 'group_show',     regex: '(group).*?(\\d+)'                  },  // group/{:id}
                 {id: 5,     name: 'group_edit',     regex: '(group).*?(\\d+).*?(edit)'         },  // group/{:id}/edit
                 {id: 6,     name: 'contacts',       regex: '(/^contacts$/)'                    },  // contacts
                 {id: 7,     name: 'contact_create', regex: '(contact).*?\\d+.*?create$'        },  // contact/create/{:group_id}
                 {id: 8,     name: 'contact_show',   regex: '(contact).*?(\\d+)$'               },  // contact/{:id}
                 {id: 9,     name: 'contact_edit',   regex: '(contact).*?(\\d+).*?(edit)'       },  // contact/{:id}/edit
                 {id: 10,     name: 'register',      regex: '(register)'                        }   // index
             ];

            var route       = 0;
            var template    = '';

            $.each(routes, function(){
                var test = new RegExp(this.regex);

                if (test.test(path)) {
                    route = this.id;
                    template = this.name;
                }
            });

            $('#template_' + template).show();

            switch (template) {

                case 'index':
                    break;

                case 'register':
                    break;

                case 'groups':

                    $('#groups_menu_left').off().on('click', function(){
                        $.redirect('index');
                    });

                    $('#groups_menu_plus').off().on('click', function(){
                        $.redirect('group/create');
                    });

                    $.api.getRecords('contact_group', '', apiKey, getToken('token'), populateGroupsTable);
                    break;

                case 'group_show':
                    $('#group_show_menu_left').off().on('click', function(){
                        $.redirect('groups');
                    });

                    $('#group_show_menu_plus').off().on('click', function(){
                        $.redirect('contact/' + pathArray[1] + '/create');
                    });

                    $('#group_show_menu_right').off().on('click', function(){
                        $.redirect('group/' + pathArray[1] + '/edit');
                    });

                    $('#group_show_menu_delete').off().on('click', function(){
                        deleteGroup(pathArray[1]);
                    });

                    var params = 'filter=id%3D' + pathArray[1] + '&fields=name';
                    $.api.getRecords('contact_group', params, apiKey, getToken('token'), populateGroupShowName);

                    params = 'filter=contact_group_id%3D' + pathArray[1] + '&fields=contact_id';
                    $.api.getRecords('contact_group_relationship', params, apiKey, getToken('token'), function(data){
                        var contacts = [];
                        $('#table_group').dataTable().fnClearTable();

                        $.each(data, function(id, contact){
                            contacts.push(contact.contact_id);
                        });

                        if(contacts.length) {
                            var params = 'ids=' + contacts.toString();
                            $.api.getRecords('contact', params, apiKey, getToken('token'), populateGroupTable);
                        }
                    });
                    break;

                case 'group_create':
                    $('#group_create_menu_left').off().on('click', function(){
                        $.redirect('groups');
                    });

                    $.api.getRecords('contact', '', apiKey, getToken('token'), populateGroupCreateTable);
                    break;

                case 'group_edit':
                    $('#group_edit_menu_left').off().on('click', function(){
                        $.redirect('group/' + pathArray[1]);
                    });

                    $('#group_edit_group').val(pathArray[1]);

                    $.api.getRecords('contact_group/' + pathArray[1], '', apiKey, getToken('token'), populateGroupName);

                    var params = 'filter=contact_group_id%3D' + pathArray[1] + '&fields=contact_id';
                    $.api.getRecords('contact_group_relationship', params, apiKey, getToken('token'), function(data) {
                        var ids = [];

                        $.each(data, function(index, value) {
                            ids.push(value.contact_id);
                        })

                        $.api.getRecords('contact', '', apiKey, getToken('token'), function(data) {
                            populateGroupEditTable(data, ids);
                        });
                    });
                    break;

                case 'contact_show':
                    $('#contact_show_menu_right').off().on('click', function(){
                        $.redirect('contact/' + pathArray[1] + '/edit');
                    });

                    $('#contact_show_menu_left').off().on('click', function(){
                        $.redirect('groups');
                    });

                    $('#contact_show_menu_delete').off().on('click', function(){
                        deleteContact(pathArray[1], previousUrl);
                    });

                    var params = 'filter=contact_id%3D' + pathArray[1];
                    $.api.getRecords('contact/' + pathArray[1], '', apiKey, getToken('token'), populateContact);
                    $.api.getRecords('contact_info', params, apiKey, getToken('token'), populateContactInfo);
                    break;

                case 'contact_create':
                    $('#contact_create_group').val(pathArray[1]);
                    $('#contact_infos').empty();

                    $('#contact_create_menu_left').off().on('click', function(){
                        $.redirect(previousUrl);
                    });

                    $('#btn_contact_cancel').off().on('click', function(){
                        $.redirect(previousUrl);
                    });
                    break;

                case 'contact_edit':
                    $('#contact_infos_edit').empty();

                    $('#contact_edit_menu_left').off().on('click', function(){
                        $.redirect('contact/' + pathArray[1]);
                    });

                    $('#btn_contact_edit_cancel').off().on('click', function(){
                        $.redirect('contact/' + pathArray[1]);
                    });

                    var params = 'filter=contact_id%3D' + pathArray[1];
                    $.api.getRecords('contact/' + pathArray[1], '', apiKey, getToken('token'), populateEditContact);
                    $.api.getRecords('contact_info', params, apiKey, getToken('token'), populateEditContactInfo);

                    break;
            }
        }
    });


}(jQuery));