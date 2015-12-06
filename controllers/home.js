angular
  .module('option-graphs')
  .controller('HomeController', function(OptionCalculator, $location) {
  	var home = this;


  	home.search = function() {
        $location.path('/options/' + home.ticker);
  	};





  });
