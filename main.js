(function() {

	var app = angular.module('itunes-search-app', ['ngRoute', 'n3-line-chart']);

	app.config(function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'templates/home.html',
			controller: 'SongsSearchController',
			controllerAs: 'vm'
			})
			.when('/search', {
				templateUrl: 'templates/apple-music.html',
				controller: 'SongsSearchController',
				controllerAs: 'vm'
			})
			.when('/options', {
				templateUrl: 'templates/options.html',
				controller: 'OptionController',
				controllerAs: 'option'
			})
			.when('/calculator', {
				templateUrl: 'templates/calculator.html',
				controller: 'CalculatorController',
				controllerAs: 'option'
			})

			.otherwise({
				redirectTo: '/options'
			});

			$locationProvider.html5Mode(true);
	});

})();
