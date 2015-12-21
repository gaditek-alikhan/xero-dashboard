App.controller('home', function($scope,$rootScope,Helper) {
	$scope.message = 'Home Page';
	$scope.userinfo = Helper.userinfo;		
});
