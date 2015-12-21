App.controller('login', function($scope,$rootScope,$location,$http,Helper) {	

	$scope.title = "Login Page";
	$scope.user = {};
	
	//$location.path();
	//$('.navbar').hide();
	//console.log($location.path());
	
	$scope.login = function() {
		
		if(typeof $scope.user.username === 'undefined'){
			Helper.notification('please enter username','error');
			return false;
		}

		if(typeof $scope.user.password === 'undefined'){
			Helper.notification('please enter password','error');
			return false;
		}	
		
		  Helper.showLoadingImage();
		  $http({
		  method  : 'POST',
		  url     : 'http://'+window.location.hostname+':9000/login',
		  data    : $.param($scope.user),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
		 })
		  .success(function(data) {	
				Helper.hideLoadingImage();
				
				if(data.message == 'success'){
					//console.log(data.user);
					Helper.userinfo = data.user;
				    var dataToStore = JSON.stringify(data.user);
					localStorage.userinfo = dataToStore;					
					Helper.notification('login success','success');
                    window.location = "#/home";
                    $('.navbar').removeClass('hide');					
				}else{
					Helper.notification('login failed','error');
				}				
							
			})
			.error(function(data) {
				console.log(data);
			});	
	}
	
});