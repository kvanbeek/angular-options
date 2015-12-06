angular
  .module('option-graphs')
  .factory('news', function($http) {
    return {


      getNews: function (stock){
        console.log(stock);
        var url = "https://access.alchemyapi.com/calls/data/GetNews?apikey=aef49ecc535bf36b92a71a1b6d90ad98ad3247ed&return=enriched.url.title,enriched.url.url&start=1448755200&end=1449442800&q.enriched.url.enrichedTitle.entities.entity=|text=" + stock + ",type=company|&count=25&outputMode=json"
        var promise = $http.get(url);
        console.log("running get news");
        return promise.then(function (response){
          return response.data.result.docs;
        })
      },






    };
  });
