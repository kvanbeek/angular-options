angular
  .module('itunes-search-app')
  .controller('OptionController', function(chain, quote, dates, OptionCalculator, $routeParams) {
    // console.log(artist, $routeParams);


    var option = this;

    // option.chain = [];
    option.chain = chain;
    // option.quote = quote.Ask;
    // option.name = quote.Name;

    option.info = quote;
    option.quote = quote.Ask;
    option.ticker = quote.Symbol;



    option.orders = [];

    // option.dates = [];
    option.dates = dates;
    // console.log(dates);
    option.date = "";

    option.loading = false;



    option.getValues = function () {
      // console.log(OptionCalculator.probability(option.stock, option.strike, option.time, option.volatility));
      // console.log(OptionCalculator.probabilityAbove(option.stock, option.strike, option.time, option.volatility));
      optionData = OptionCalculator.black_scholes(option.kind, option.stock, option.strike, option.risk, option.volatility, option.time);
      option.price = optionData.price;
      option.delta = optionData.delta;
      option.gamma = optionData.gamma;
      option.theta = optionData.theta;
      option.rho = optionData.rho;
    }


    option.getQuote = function(){
      OptionCalculator.getQuote(option.ticker).then(function (response){
      option.info = response.quote;
      option.quote = response.quote.Ask;
    });
  }


    option.getChain = function(){
      console.log(option.ticker);

      option.loading = true;

      OptionCalculator.getDates(option.ticker).then(function (response) {
        option.dates = [];
        console.log(response);
        for (var i = 0; i < response.option.length; i++) {
          console.log(response.option[i].value);
          console.log(response.option[i].content);
          var newDate = {
            value: response.option[i].value,
            content: response.option[i].content
          };

          option.dates.push(newDate);

        }
      });

      var getOptions = OptionCalculator.getOptions(option.ticker, option.date).then(function (response) {


        var newResponse = [];

        for (var i = 0; i < response.td.length; i+=10) {
          var test = response.td.slice(i, i+10);

          newResponse.push(test);
        }
        option.loading = false;
        option.chain = newResponse;
      });
    }



    option.buy = function (equity) {
      option.orderBook = true;
      var order = {
        side: "Buy",
        call: true,
        buy: true,
        strike: parseFloat(equity[0].strong.a.content),
        premium: parseFloat(equity[3].div.content),
        type: "Call"
      };
      option.orders.push(order);
      option.data  = [];

      // option.buildGraph(54, option.orders);
      option.buildGraph(parseFloat(option.quote), option.orders);

    }



    option.sell = function (equity) {
      option.orderBook = true;
      var order = {
        side: "Sell",
        call: true,
        buy: false,
        strike: parseFloat(equity[0].strong.a.content),
        premium: parseFloat(equity[4].div.content),
        type: "Call"
      };
      option.orders.push(order);
      option.data  = [];
      option.buildGraph(parseFloat(option.quote), option.orders);
    }

    option.remove = function (orderIndex){
      option.orders.splice(orderIndex, 1);

      // var reloadOrders = option.orders;
      option.data = [];
      if (option.orders.length > 0){
        option.buildGraph(parseFloat(option.quote), option.orders);
      }

    }

    option.change = function () {

      option.loading = true;
      OptionCalculator.getOptions(option.ticker, option.date).then(function (response) {

        var newResponse = [];

        for (var i = 0; i < response.td.length; i+=10) {
          var test = response.td.slice(i, i+10);
          // console.log(i);
          // console.log(test);
          newResponse.push(test);
        }
        option.loading = false;
        option.chain = newResponse;
      });
    }






    option.data = [];


    function buildDataSet(stock, options) {
      // options, puts, stock

      var profit = 0;

      for (var i = 0; i < options.length; i++) {
        // console.log(options[i].strike, options[i].premium, stock);
        if (options[i].buy && options[i].call){
          profit = profit + OptionCalculator.callOptionProfitLoss(stock, options[i].strike, options[i].premium);
          console.log('the call ran', option.quote, options[i].strike, options[i].premium);
          // console.log(profit);
        } else if (!options[i].buy && options[i].call){
          profit = profit + OptionCalculator.writtenCallOptionProfitLoss(stock, options[i].strike, options[i].premium);
          console.log('the non call ran');
        }
      }
      console.log("Profit: " + profit);
      return profit;

    }



    option.buildGraph = function (stock, options) {
      console.log(options);
      for (var i = -10; i < 20; i+= 0.1) {
        var dataSet = {
        x: stock + i,
        val_0: buildDataSet(stock + i, options) * 100,
        val_1: 0,
        val_2: 0,
        val_3: 0
        }
        option.data.push(dataSet);
        // console.log(dataSet);
      }
    }



      option.options = {
      series: [
        {
          y: "val_0",
          label: "Profit",
          color: "#ff7f0e",
          drawDots: false
        },
        {
          y: "val_1",
          label: "Breakeven",
          color: "#d62728",
          drawDots: false
        }
      ],
    };



  });
