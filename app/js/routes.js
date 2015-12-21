App.config(function($routeProvider,$locationProvider) {

	$routeProvider
	
		// Login
		.when('/login', {
			templateUrl	: 'views/login.html',
			controller 	: 'login',
		})
		
		// Logout
		.when('/logout', {
			templateUrl	: 'views/login.html',
			controller 	: 'logout'
		})
		
	    // Home
		.when('/', {
			templateUrl	: 'views/home.html',
			controller 	: 'home',
			requireLogin: 'yes'
		})
		
		// Dashboard
		.when('/dashboard', {
			templateUrl : 'views/dashboard.html',
			controller 	: 'dashboard',
			requireLogin: 'yes'
		})
					
		.otherwise({
			redirectTo: '/'
		});
		
		//$locationProvider.html5Mode(true);
});