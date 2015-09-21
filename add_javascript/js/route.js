

(function($) {

    $.extend({

        redirect: function(path) {

            var previousUrl = window.location.hash.slice(1);
            window.location.hash = '#' + path;

            var pathArray = path.split('/');

            $('div[id^="template_"]').hide();
            $('button[id^="menu_"]').hide();

             var routes = [
                 {id: 1,     name: 'index',          regex: '(index)'                        },  // index
                 {id: 2,     name: 'groups',         regex: '(groups)'                       },  // groups
                 {id: 3,     name: 'group_create',   regex: '(group/create)'                 },  // group/create
                 {id: 4,     name: 'group_show',     regex: '(group).*?(\\d+)'               },  // group/{:id}
                 {id: 5,     name: 'group_edit',     regex: '(group).*?(\\d+).*?(edit)'      },  // group/{:id}/edit
                 {id: 6,     name: 'contacts',       regex: '(/^contacts$/)'                     },  // contacts
                 {id: 7,     name: 'contact_create', regex: 'contact.*?\\d+.*?create$'               },  // contact/create/{:group_id}
                 {id: 8,     name: 'contact_show',   regex: '^(contact).*?(\\d+)$'             },  // contact/{:id}
                 {id: 9,     name: 'contact_edit',   regex: '(/^contact$/).*?(\\d+).*?(edit)'    }   // contact/{:id}/edit
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

                case 'groups':

                    $('#groups_menu_left').on('click', function(){
                        $.redirect('index');
                    });

                    $('#groups_menu_plus').on('click', function(){
                        $.redirect('group/create');
                    });
                    $.api.getRecords('contact_groups', '', apiKey, getCookie('token'), populateGroupsTable);
                    break;

                case 'group_show':

                    $('#group_show_menu_left').on('click', function(){
                        $.redirect('groups');
                    });

                    $('#group_show_menu_plus').on('click', function(){
                        console.log('contact/create');
                        $.redirect('contact/15/create');
                    });

                    var params = 'filter=contactGroupId%3D' + pathArray[1] + '&fields=contactId';
                    $.api.getRecords('contact_relationships', params, apiKey, getCookie('token'), function(data){
                        var contacts = '';

                        $.each(data, function(id, contact){
                            contacts += contact.contactId + ',';
                        });

                        if(contacts) {
                            var params = 'ids=' + contacts;
                            $.api.getRecords('contacts', params, apiKey, getCookie('token'), populateGroupTable);
                        }
                    });
                    break;

                case 'group_create':
                    $('#group_create_menu_left').on('click', function(){
                        $.redirect('groups');
                    });

                    $.api.getRecords('contacts', '', apiKey, getCookie('token'), populateGroupCreateTable);
                    break;

                case 'contact_show':
                    $('#contact_show_menu_left').on('click', function(){
                        $.redirect(previousUrl);
                    });

                    var params = 'filter=contactId%3D' + pathArray[1];
                    $.api.getRecords('contacts/' + pathArray[1], '', apiKey, getCookie('token'), populateContact);
                    $.api.getRecords('contact_info', params, apiKey, getCookie('token'), populateContactInfo);
                    break;

                case 'contact_create':
                    $('#contact_create_group').val(pathArray[1]);

                    $('#contact_create_menu_left').on('click', function(){
                        $.redirect(previousUrl);
                    });
                    break;
            }
        }
    });

}(jQuery));