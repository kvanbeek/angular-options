(function() {

	var app = angular.module('itunes-search-app', ['ngRoute', 'n3-line-chart']);

	app.config(function($routeProvider) {
		$routeProvider
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
			.otherwise({
				redirectTo: '/options'
			});
	});

})();
