var App = angular.module('App', ['ngRoute','ui.filters', 'AxelSoft']);

App.directive('hiChart', function(){
   return {
      restrict: 'E',
      replace: true,
      scope: {
         val:'='
      },
      link: function(scope, elm, attrs){
         scope.$watch('val', function(value) {
            value.chart.renderTo = elm[0];
            new Highcharts.Chart(value);
         });
      }
   };
});

App.config(function ($httpProvider) {
         $httpProvider.interceptors.push(function ($q,$rootScope) {
             return {
                 'request': function (config) {				 

				     var userinfo = JSON.parse(localStorage.getItem('userinfo'));
					 //console.log(userinfo);
					 if(userinfo){
						//console.log(config.url);
						if( config.url.indexOf('.html') >= 0){
							config.url = config.url + '?token='+userinfo.token;
						}else{
						config.url = config.url + '&token='+userinfo.token;
						}
						//config.url = config.url + '?token='+userinfo.token;
					 }
					 //config.data = config.data + '&token='+$rootScope.userinfo.token;					 
                     return config || $q.when(config);

                 }

             }
         });
     });

App.run(function($rootScope, $location) {
    
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
						
			if(next.requireLogin == 'yes') {				
			    var userinfo = JSON.parse(localStorage.getItem('userinfo'));
				if(userinfo == null){	
					$('.navbar').addClass('hide');				
					$location.path("/login");
				}
			}      
    })
  });

  