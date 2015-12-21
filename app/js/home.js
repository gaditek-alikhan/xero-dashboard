$(document).ready(function()
{	
	
	var Home = Home || {};

	Home.PrepareMultiDataTableFromDataSource = function(dataSet) {
    var header_columns = '';
    var rows = '';
    $.each(dataSet[0], function(k,v) {
 

        header_columns += '<th>' + k +  '</th>';
    });

    $.each(dataSet, function(k,v) {

        if(v.hasOwnProperty('id')){
            rows += '<tr id="' + v['id'] + '">';
        } else {
            rows += '<tr>';
        }
        $.each(v, function(k1,v1) {

            
                rows += '<td>' + v1 +  '</td>';
            

        });
        rows + '</tr>';
    });
    var html = $('.tmp_SimpleTable').html();
	//html = html.replace('{{title}}', options.title);
    html = html.replace('{{header_columns}}', header_columns);
    html = html.replace('{{rows}}', rows);
    return html;
};


Home.AttachDataTable = function (selector) {

    /*
     * Initialize DataTables, with no sorting on the 'details' column
     */

    if ( $.fn.DataTable.fnIsDataTable( selector ) ) {
        var oTable = $(selector).dataTable();
        oTable.fnDestroy();
        oTable = undefined;
    }
    var oTable = $(selector).dataTable( {
        /*"aoColumnDefs": [
         {"bSortable": false, "aTargets": [ 0 ] }
         ],*/
        "aaSorting": [[0, 'desc']],
        "aLengthMenu": [
            [10, 15, 20, -1],
            [10, 15, 20, "All"] // change per page values here
        ],
        "aoColumnDefs": [
        {
          "bSortable": false,
          "aTargets": [ -1 ] // <-- gets last column and turns off sorting
         }
         ],

        // set the initial value
        "iDisplayLength": 10

    });




    //jQuery('.dataTables_filter input').addClass("form-control input-small input-inline"); // modify table search input
    //jQuery('.dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
    //jQuery('.dataTables_length select').select2(); // initialize select2 dropdown
};

	
	
	
    Home.Get_Data = function() {
    //console.log('get data called');
    var url =  config.base+'home/getdata';
	
	$.ajax(
		{
			url : url,
			type: "GET",
			success:function(data, textStatus, jqXHR)
			{				  
				  	var obj = jQuery.parseJSON(data);
					console.log(obj.data);	
                   var html = Home.PrepareMultiDataTableFromDataSource(obj.data);
				   console.log(html);
                   $('div.content').html(html);
                   Home.AttachDataTable('.tbl-SimpleTable');

                    //$('table.tbl-SimpleTable').dataTable();					
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	
    };
	
	Home.Get_Data();

      	
	/*
	$('.generate-model').click(function()
	{
   	
		var training_data = $('.training_data').val();
		if(training_data == ''){
		alert("Plz Enter Training Data");
		return false;
		}
			
	   $.isLoading({ text: "<strong>please wait while processing request</strong>"});
		  	    
		var postData = $('.training-form').serializeArray();
		$.ajax(
		{
			url : 'model/helper.php',
			type: "POST",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{				  
				  setTimeout(Finished_Model_Generation, 3000)				
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
		
	});
	
	function Finished_Model_Generation(){			
		$.isLoading( "hide" );
 	    $('div.result').html('');		
	}
		
	$('.test-model').click(function()
	{
   	
		var testing_data = $('.testing_data').val();
		if(testing_data == ''){
		alert("Plz Enter Testing Data");
		return false;
		}
			
   	   $.isLoading({ text: "<strong>please wait while processing request</strong>"});
		var postData = $('.testing-form').serializeArray();
		$.ajax(
		{
			url : 'model/helper.php',
			type: "POST",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{
				//data: return data from server
				setTimeout(Load_Result, 7000)				

			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
		
	});
		 
 
	function Load_Result(){
	
		$.get( "model/helper.php?task=get_result", function( data ) {
		data = data != '' ? data : '<span class="text-danger">there are some problems plz see logs for error info</span>';
		$("div.result").html(data);
		$.isLoading( "hide" );
		});
	
	}
	
	function Load_Logs(){	
		
		$("div.logs").load('model/job_output.txt');
		
	}
	setInterval(Load_Logs, 5000);	
	*/	
	
});