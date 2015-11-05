angular
  .module('itunes-search-app')
  .factory('Artist', function($http) {
    return {
      findAll: function() {
        return $http.get('https://itp-api.herokuapp.com/artists').then(function(response) {
          return response.data.artists;
        });
      },

      findAlbums: function(artistId) {
        var url = "https://itunes.apple.com/lookup?id=" + artistId + "&entity=album&callback=JSON_CALLBACK";
        // var promise = $http.jsonp(url);
        console.log('find albums service started');
        console.log("url: " + url);

        return $http.jsonp(url).then(function(response) {
          console.log('logging response of albums service from within find albums');
          return response.data.results;
        });

      
      },


      findRecord: function(id) {
        return $http.get('https://itp-api.herokuapp.com/artists/' + id).then(function(response) {
          return response.data.artist;
        });
      }
    };
  });
