angular
  .module('itunes-search-app')
  .controller('OptionController', function(OptionCalculator) {
    // console.log(artist, $routeParams);


    var option = this;

    option.chain = [];
    option.orders = [];


    option.getValues = function () {
      // console.log(OptionCalculator.probability(option.stock, option.strike, option.time, option.volatility));
      // console.log(OptionCalculator.probabilityAbove(option.stock, option.strike, option.time, option.volatility));
      optionData = OptionCalculator.black_scholes(option.kind, option.stock, option.strike, option.risk, option.volatility, option.time);
      console.log(optionData);
      option.price = optionData.price;
      option.delta = optionData.delta;
      option.gamma = optionData.gamma;
      option.theta = optionData.theta;
      option.rho = optionData.rho;
    }


    option.getQuote = function(){
      OptionCalculator.getQuote(option.ticker).then(function (response){
      option.quote = response.quote.Ask;
    });
  }


    option.getChain = function(){
      console.log(option.ticker);
      var getOptions = OptionCalculator.getOptions(option.ticker).then(function (response) {
        console.log('the response');
        console.log(response);
        console.log(response.td.length/10);

        var newResponse = [];

        for (var i = 0; i < response.td.length; i+=10) {
          var test = response.td.slice(i, i+10);
          console.log(i);
          console.log(test);
          newResponse.push(test);
        }
        option.chain = newResponse;
      });
    }


    option.buy = function (equity) {
      console.log(equity);
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

      console.log("******************");
      // option.buildGraph(54, option.orders);
      option.buildGraph(parseFloat(option.quote), option.orders);

    }



    option.sell = function (equity) {
      console.log(equity);
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
      console.log(orderIndex);
      option.orders.splice(orderIndex, 1);

      // var reloadOrders = option.orders;
      option.data = [];
      option.buildGraph(parseFloat(option.quote), option.orders);
    }

    option.change = function () {
      console.log("Change on table");
    }


    option.data = [];

    // var listOptions = [
    //   {
    //     call: true,
    //     buy: false,
    //     strike: 57,
    //     premium: 2
    //   },
    //   {
    //     call: true,
    //     buy: true,
    //     strike: 50,
    //     premium: 4
    //   }
    // ];

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
      for (var i = -10; i < 20; i+= 0.5) {
        var dataSet = {
        x: stock + i,
        val_0: buildDataSet(stock + i, options),
        val_1: 0,
        val_2: 0,
        val_3: 0
        }
        option.data.push(dataSet);
        console.log(dataSet);
      }
    }

    // OptionCalculator(stock + i, target)
    // function(price, target, days, volatility)






    // option.buildGraph(55, listOptions);

      option.options = {
      series: [
        {
          y: "val_0",
          label: "Profit",
          color: "#ff7f0e"
        },
        {
          y: "val_1",
          label: "Breakeven",
          color: "#d62728"
        }
      ]
    };
  // option.data.forEach(function(row) {
  //   row.x = new Date(row.x);
  // });


  });
