    App.controller('dashboard', function($scope,$http,Helper) {	


		// initilize dates
		$scope.start_date = "2015-12-01";
		$scope.end_date = "2015-12-31";
		
		
		// generate data for series type chart
		$scope.Generate_Series_Data = function(data) {
		
			data.payments = _.sortBy(data, 'date_time');		
			var payment_types = _.uniq(_.pluck( data.payments, 'payment_type' ));
					
			var payment_by_dates = [];
			$.each(payment_types, function(key, val) {	
			
				var tmp = {};
				tmp.name = val;
				tmp.data = [];
							
				$.each(data.payments, function(key2, payment) {
					if(payment.payment_type == val){
					
					if (!tmp.data.hasOwnProperty(payment.date_time)) {
					tmp.data[payment.date_time] = 0;
					}
					tmp.data[payment.date_time] += parseFloat(payment.bank_amount);
					}
			
				});
			
				payment_by_dates.push(tmp);
			
			});
			
			 var series_data = [];			 
			 $.each(payment_by_dates, function(k, s) {
			 
				var tmp = {};
				tmp.data = [];				
				tmp.name = s.name;
				var data = s.data;				
				
				for (var prop in data) {
                if(data.hasOwnProperty(prop)){					
					var timestamp = (new Date(prop).getTime());					
					tmp.data.push([timestamp,data[prop]]);					
				  }
			    }
				
				tmp.data = _.sortBy(tmp.data);
				series_data.push(tmp);
			 });
			 
			return series_data;
		};
		
	    $scope.Get_Data = function() {
    	
			if($scope.start_date == '' || $scope.end_date == ''){
				Helper.notification('please enter start date & end date','error');
				return false;
			}			
			
			Helper.showLoadingImage();		
			$http.get('http://'+window.location.hostname+':9000/dashboard?start_date='+$scope.start_date+'&end_date='+$scope.end_date+'&')
			.success(function(data) {		    
				
				var html = "<strong class='error'>No Records Found</strong>";
				if(data.accounts.length !== 0){
					html = Helper.PrepareMultiDataTableFromDataSource(data.accounts);
				}		   
				$('div.accounts').html(html);
				
				var html = "<strong class='error'>No Records Found</strong>";
				if(data.payments.length !== 0){
					html = Helper.PrepareMultiDataTableFromDataSource(data.payments);
				}		   
				$('div.payments').html(html);  
			   
			   Helper.AttachDataTable('.tbl-SimpleTable');		   
			   
			   var chart_data = [];
			   
				if(_.size(data.payment_types) !== 0){
					   
					var chart_data = _.map(data.payment_types, function(value, prop) {
					return { name: prop, y: value };
					});
				   
					Helper.generatePieChart('div.containerpie',chart_data);
					var series_data = $scope.Generate_Series_Data(data.payments);			
					//console.log(JSON.stringify(series_data));
					Helper.generateSeriesChart('div.containertimeseries',series_data);
					Helper.hideLoadingImage();
					Helper.notification('Date Retrieval is Successfull','success');
			   }		    
				
			})
			.error(function(data) {
				console.log('Error: ' + data);
				Helper.notification('Date Retrieval Failed. Error: '+data,'error');
			});		
		
		};	
		
	//$scope.Get_Data();
	
});