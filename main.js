(function() {

	var app = angular.module('itunes-search-app', ['ngRoute', 'n3-line-chart']);

	app.config(function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'templates/home.html',
			controller: 'HomeController',
			controllerAs: 'home'
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
			.when('/options/:ticker', {
				templateUrl: 'templates/options.html',
				controller: 'OptionController',
				controllerAs: 'option',
				resolve: {
					chain: function(OptionCalculator, $route, $location) {

						return OptionCalculator.getOptions($route.current.params.ticker, "").then(function (response) {
							console.log('Get Options on Resolve called');


							var chain = [];

							for (var i = 0; i < response.td.length; i+=10) {
								var test = response.td.slice(i, i+10);
								// console.log(i);
								// console.log(test);
								chain.push(test);
							}
							return chain;
						}, function() {
							$location.path('/');
						});
					},
					quote: function (OptionCalculator, $route, $location){
						return OptionCalculator.getQuote($route.current.params.ticker).then(function (response){
							console.log(response.quote);
			      	return response.quote;
			    });
					},
					dates: function (OptionCalculator, $route, $location){
						return OptionCalculator.getDates($route.current.params.ticker).then(function (response) {
			        console.log(response);
							var dateHolder = [];
			        for (var i = 0; i < response.option.length; i++) {
			          console.log(response.option[i].value);
			          console.log(response.option[i].content);
			          var newDate = {
			            value: response.option[i].value,
			            content: response.option[i].content
			          };

			          dateHolder.push(newDate);

			        }

							return dateHolder;
			      });
					}
				}
			})

			.otherwise({
				redirectTo: '/'
			});

			$locationProvider.html5Mode(true);
	});

})();
