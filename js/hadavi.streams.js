/* Script for Hadavi actions

Stephen Dade
*/

//has the streams list been changed?
var changedStreams = false;

jQuery(document).ready(function() {
    //Show user account details
    request = jQuery.ajax({
        url: ajax_object.ajax_url.concat('?action=hd_getaccountdetails'),
        dataType: "JSON",
        success: function(json){
            // Update the input controls
            jQuery('#UsermaxStreams').html("<p>Using " + json.Record.numStreams + " of " + json.Record.maxStreams + " streams.</p>");
            jQuery('#UsermaxViews').html("<p>Using " + json.Record.numViews + " of " + json.Record.maxViews + " views.</p>");
            jQuery('#UserminRefresh').html("<p>Minimum time between stream inserts is " + json.Record.minRefresh + " sec.</p>");
            if(json.Record.timeOut == '0') {
                jQuery('#UsertimeOut').html("");  
            }
            else {
                var myDate = new Date( parseInt(json.Record.timeOut));
                jQuery('#UsertimeOut').html("<p>Account Renewal: " + myDate.toGMTString() + "</p>");
            }
        },       
        // Callback handler that will be called on failure
        error: function (jqXHR, textStatus, errorThrown){
            // Log the error to the console
            //console.error(
            //    "The following error occurred: "+
            //    textStatus, errorThrown
            //);
            jQuery('#UsermaxStreams').html(textStatus);
        }
    });
    
    //Prepare jTable for streams view
	jQuery('#StreamsTableContainer').jtable({
		title: 'Streams',
		paging: false,
		sorting: false,
        jqueryuiTheme: true,
        openChildAsAccordion: true,
		actions: {
			listAction: ajax_object.ajax_url.concat('?action=hd_list_stream'),
			createAction: ajax_object.ajax_url.concat('?action=hd_create_stream'),
			updateAction: ajax_object.ajax_url.concat('?action=hd_edit_stream'),
			deleteAction: ajax_object.ajax_url.concat('?action=hd_delete_stream')
		},
		fields: {
			Name: {
				title: 'Stream Name',
				width: '20%'
			},
			Token: {
				title: 'Token',
				width: '15%',
                create: false,
				edit: false,
                key: true
			},
			Stream_Usage: {
				title: 'Usage',
				width: '5%',
				create: false,
				edit: false
			},
            minValue: {
				title: 'Min Value',
				width: '5%',
				create: true,
				edit: true
			},
            maxValue: {
				title: 'Max Value',
				width: '5%',
				create: true,
				edit: true
			},
            Data_URL: {
				title: 'Data URL',
				width: '50%',
				create: false,
				edit: false
			}
		},
        
        //need events to signal that the views stream option needs
        //to be reloaded
        recordAdded: function (event, data) {
            if (data.record) {
                changedStreams = true;
            }
        },
        recordDeleted: function (event, data) {
            if (data.record) {
                changedStreams = true;
            }
        }
        
	});

	//Load streams list
	jQuery('#StreamsTableContainer').jtable('load');
    
    //Prepare jTable for views view
	jQuery('#ViewsTableContainer').jtable({
		title: 'Views',
		paging: false,
		sorting: false,
        jqueryuiTheme: true,
        openChildAsAccordion: true,
		actions: {
			listAction: ajax_object.ajax_url.concat('?action=hd_list_view'),
			createAction: ajax_object.ajax_url.concat('?action=hd_create_view'),
			updateAction: ajax_object.ajax_url.concat('?action=hd_edit_view'),
			deleteAction: ajax_object.ajax_url.concat('?action=hd_delete_view')
		},
		fields: {
			Name: {
				title: 'View Name',
				width: '20%',
                create: true,
                key: true,
			},
			Token: {
				title: 'Data Source',
				width: '20%',
                create: true,
				edit: true,
                options: function(data) {
                    if(changedStreams == true) {
                        //clear the options cache if required
                        data.clearCache();
                        changedStreams = false;
                    }
                    return ajax_object.ajax_url.concat('?action=hd_list_viewstreamoptions');
                }
			},
            Timezone: {
				title: 'Timezone',
				width: '5%',
				create: true,
				edit: true,
                options: [{ Value: '-12', DisplayText: '-12' }, { Value: '-11', DisplayText: '-11' }, { Value: '-10', DisplayText: '-10' }, { Value: '-9', DisplayText: '-9' }, { Value: '-8', DisplayText: '-8' }, { Value: '-7', DisplayText: '-7' }, { Value: '-6', DisplayText: '-6' }, { Value: '-5', DisplayText: '-5' }, { Value: '-4', DisplayText: '-4' }, { Value: '-3', DisplayText: '-3' }, { Value: '-2', DisplayText: '-2' }, { Value: '-1', DisplayText: '-1' }, { Value: '0', DisplayText: '0 (UTC)' }, { Value: '1', DisplayText: '+1' }, { Value: '2', DisplayText: '+2' }, { Value: '3', DisplayText: '+3' }, { Value: '4', DisplayText: '+4' }, { Value: '5', DisplayText: '+5' }, { Value: '6', DisplayText: '+6' }, { Value: '7', DisplayText: '+7' }, { Value: '8', DisplayText: '+8' }, { Value: '9', DisplayText: '+9' }, { Value: '10', DisplayText: '+10' }, { Value: '11', DisplayText: '+11' }, { Value: '12', DisplayText: '+12' }]
            },
			Format: {
				title: 'Type',
				width: '5%',
				create: true,
				edit: true,
                options: ['svg','csv','html','chartjs']
			},
            View_URL: {
				title: 'URL',
				width: '40%',
				create: false,
				edit: false
                
			}
		}
	});

	//Load views list
	jQuery('#ViewsTableContainer').jtable('load');

});