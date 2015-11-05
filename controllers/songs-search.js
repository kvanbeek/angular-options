angular
  .module('itunes-search-app')
  .controller('SongsSearchController', function(iTunes, $location) {
  	var vm = this;
  	vm.previousSearches = [];
  	vm.favoriteSongs = [];

  	vm.search = function() {
  		console.log(vm.artistSearch);
  		vm.loading = true;

  		iTunes.search(vm.artistSearch).then(function(response) {
  			// var songs = response.data.results;
        var artistId = response[0].artistId;
        console.log(artistId);
  			var songs = response;
  			// var priceBreakdown = iTunes.getPriceStats(songs);
  			// console.log(priceBreakdown);
  			// vm.priceBreakdown = priceBreakdown;

  			// vm.songs = songs;
  			// vm.loading = false;
  			vm.previousSearches.push(vm.artistSearch);
  			vm.artistSearch = '';


        $location.path('/artists/' + artistId);
  		});
  	};

  	vm.favorite = function(song) {
  		vm.favoriteSongs.push(song);
  		song.favorited = true;
  	};
  });
