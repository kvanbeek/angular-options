angular
  .module('option-graphs')
  .controller('HomeController', function(OptionCalculator, $location, auth, store) {
  	var home = this;


  	home.search = function() {
        $location.path('/options/' + home.ticker);
  	};

    home.login = function () {
      auth.signin({}, function (profile, token) {
        store.set('profile', profile);
        store.set('token', token);
        $location.path('/');

      }, function () {
        // error call back
      });
    }



  });
