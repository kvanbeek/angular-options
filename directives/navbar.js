angular
  .module('itunes-search-app')
  .directive('navBar', function() {
  	return {
  		restrict: 'E',
  		templateUrl: '/templates/directives/navbar.html'
  	};
  });
