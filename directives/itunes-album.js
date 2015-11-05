angular
  .module('itunes-search-app')
  .directive('itunesAlbum', function() {
  	return {
  		restrict: 'E',
  		templateUrl: '/templates/directives/itunes-album.html',
  		scope: {
        album: '=',
        click: '&'
      },
      link: function(scope) {

        
      }
  	};
  });



