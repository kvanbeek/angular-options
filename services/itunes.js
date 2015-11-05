angular
  .module('itunes-search-app')
  .factory('iTunes', function($http) {
  	var cache = {};

  	return {
  		search: function(artist) {
  			var url = 'https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK';
  			var promise = $http.jsonp(url);

  			// return promise;
  			return promise.then(function(response) {
  				return response.data.results;
  			});
  		},

  		// prevent duplicates
  		// search: function(artist) {
  		// 	var url, promise;
  		//
  		// 	if (cache[artist]) {
  		// 		return cache[artist];
  		// 	}
  		//
  		// 	url = 'https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK';
  		// 	cache[artist] = $http.jsonp(url).then(function(response) {
  		// 		return response.data.results;
  		// 	});
  		//
  		// 	return cache[artist];
  		// },

  		getPriceStats: function(songs) {
  			var prices = {};

  			songs.forEach(function(song) {
  				if (prices[song.trackPrice]) {
  					prices[song.trackPrice] += 1;
  				} else {
  					prices[song.trackPrice] = 1;
  				}
  			});

  			return prices;
  		}
  	};
  });
