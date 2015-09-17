

    //--------------------------------------------------------------------------
    //  Defines
    //--------------------------------------------------------------------------

    var instanceHost	= 'http://localhost:8080';
    var apiKey 			= '8ca4d26917f4802693ad5219e0b7777e0c6b05ed01e842424c75453caffb0ee1';



    //--------------------------------------------------------------------------
    //  App init
    //--------------------------------------------------------------------------

    $('div[id^="template_"]').hide();
    $('#template_index').show();

    $('#menu_left').hide();
    $('#menu_right').hide();
    $('#menu_plus').hide();

    $.redirect('index');


    //--------------------------------------------------------------------------
    //  Login/Register
    //--------------------------------------------------------------------------

    $('#signin').on('click', function () {
        var email = $('#email').val();
        var password = $('#password').val();

        if (!$.api.login(email, password)) {
            $.redirect('groups');
        }
    });


    //--------------------------------------------------------------------------
    //  Groups          groups
    //--------------------------------------------------------------------------

    var table = $('#table_groups').DataTable({
        "paging":   false,
        "ordering": false,
        "info":     false,
        "columnDefs": [
            { "visible": false, "targets": 0 }
        ]
    } );

    // Detect click on table row
    $('#table_groups tbody').on( 'click', 'tr', function () {
        var groupId = $('#table_groups').DataTable().row(this).data();
        $.redirect('group/' + groupId[0]);
    } );

    // Callback function, populate groups table
    var populateGroupsTable = function(data) {
        var _groups = data;
        var groups = [];

        $.each(_groups, function(id, group){
            groups.push([
                group.contactGroupId,
                group.groupName
            ])
        })

        $('#table_groups').dataTable().fnClearTable();
        $('#table_groups').dataTable().fnAddData(groups);
    }


    //--------------------------------------------------------------------------
    //  Group Create    group/create
    //--------------------------------------------------------------------------

    var tableGroupCreate = $('#table_group_create').DataTable({
        "paging":   false,
        "ordering": false,
        "info":     false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { "visible": false, "targets": 2 }
        ],
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group info"><td colspan="3">'+group+'</td></tr>'
                    );

                    last = group;
                }
            } );

            $("#table_group_create thead").remove();
            $("#table_group_create tfoot").remove();
        }
    } );

    var populateGroupCreateTable = function(data) {
        var contacts = [];

        $.each(data, function(id, contact){
            contacts.push([
                contact.contactId,
                contact.firstName + ' ' + contact.lastName,
                contact.lastName.charAt(0).toUpperCase(),
                "<button type='button' class='btn btn-default btn-xs pull-right' data-toggle='button' aria-pressed='false' autocomplete='off' id='contact_" + contact.contactId + "'>Select</button>"
            ])
        })

        $('#table_group_create').dataTable().fnAddData(contacts);
    }

    $('#group_save').on('click', function() {
        var save = {};
        save['groupName'] = $('#groupName').val();

        var params = JSON.stringify(save);

        $.api.setRecord('contact_groups', params, apiKey, getCookie('token'), function (data) {
            //console.log(data);
            var groupId  = data[0].contactGroupId;
            //console.log(groupId);
            createRelationships(groupId);
        });
    });

    function createRelationships(groupId) {
        $('#table_group_create tr').each(function() {
            var columns = $(this).find('td');

            columns.each(function() {
                var box = $(this).find('button');

                if(box.length){
                    var id = box[0].id;

                    if ($('#' + id).hasClass('active')) {
                        var save = {};

                        save['contactGroupId'] = groupId;
                        save['contactId'] = id.replace('contact_', '');

                        var params = JSON.stringify(save);

                        $.api.setRecord('contact_relationships', params, apiKey, getCookie('token'), function (data){});
                    }
                }
            });
        });
    }


    //--------------------------------------------------------------------------
    //  Group       group/{id}
    //--------------------------------------------------------------------------

    var tableGroup = $('#table_group').DataTable({
        "paging":   false,
        "ordering": false,
        "info":     false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { "visible": false, "targets": 2 }
        ],

        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group info"><td colspan="3">'+group+'</td></tr>'
                    );

                    last = group;
                }
            } );

            $("#table_group thead").remove();
            $("#table_group tfoot").remove();
        }

    });

    var populateGroupTable = function(data) {
        var users = [];

        $.each(data, function(id, user){
            users.push([
                user.contactId,
                user.firstName + ' ' + user.lastName,
                user.lastName.charAt(0).toUpperCase()
            ])
        });

        $('#table_group').dataTable().fnClearTable();
        $('#table_group').dataTable().fnAddData(users);
    }

    $('#table_group_search').keyup(function(){
        $('#table_group').DataTable().search($(this).val(), false, true).draw() ;
    });

    $('#table_group tbody').on( 'click', 'tr', function () {
        var contactId = $('#table_group').DataTable().row(this).data();

        if (contactId !== undefined)
            $.redirect('contact/' + contactId[0]);
    });


    //--------------------------------------------------------------------------
    //  Group       group/{id}
    //--------------------------------------------------------------------------

    var populateContact = function(data) {
        console.log(data);

        $('#contact_firstName').text(data.firstName);
        $('#contact_lastName').text(data.lastName);
        $('#contact_notes').text(data.notes);

        if(data.twitter)
            $('#contact_social').append('<img src="img/twitter2.png" height="25">&nbsp;&nbsp;' +
            data.twitter + '<br><br>');

        if(data.skype)
            $('#contact_social').append('<img src="img/skype.png" height="25">&nbsp;&nbsp;' +
            data.skype + '<br><br>');
    }


    //--------------------------------------------------------------------------
    //  Misc functions
    //--------------------------------------------------------------------------

    function setCookie(key, value) {
        console.log('here');
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        window.parent.document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    function getCookie(key) {
        var keyValue = window.parent.document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }













