angular
  .module('itunes-search-app')
  .controller('ArtistController', function(artist, genres, $routeParams) {
    // console.log(artist, $routeParams);
    var vm = this;
    vm.artist = artist;
    console.log("vm artist: ");
    console.log(vm.artist);
    vm.favorite = function(album) {
  		console.log('favorite was clicked');
  		var stringifyAlbum = JSON.stringify(album);
  		console.log(stringifyAlbum);
  		localStorage.setItem('collectionId', stringifyAlbum);
  	};
  });
