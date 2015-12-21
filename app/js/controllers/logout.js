App.controller('logout', function($scope,$rootScope,$location,$http,Helper) {
	
	localStorage.removeItem(userinfo);
	localStorage.clear();
	$('.navbar').addClass('hide');
	Helper.notification('logout success','success');
    window.location = "#/login";
	
});