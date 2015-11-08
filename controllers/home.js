angular
  .module('itunes-search-app')
  .controller('HomeController', function(OptionCalculator, $location) {
  	var home = this;


  	home.search = function() {
        $location.path('/options/' + home.ticker);
  	};


  });
