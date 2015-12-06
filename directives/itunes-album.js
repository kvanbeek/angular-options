angular
  .module('option-graphs')
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
