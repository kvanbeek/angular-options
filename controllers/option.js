angular
  .module('option-graphs')
  .controller('OptionController', function(chain, puts, quote, dates, OptionCalculator, $routeParams, news) {


    // console.log(artist, $routeParams);
    // option.news = stocknews;


    var option = this;

    option.showCalls = true;
    // option.chain = [];
    option.chain = chain;
    option.puts = puts;
    // option.quote = quote.Ask;
    // option.name = quote.Name;

    option.info = quote;
    option.quote = quote.Ask;
    option.ticker = quote.Symbol;

    news.getNews(option.info.Name).then(function (response) {
      option.news = response;
      console.log(response);
    });

    option.showPuts = false;
    option.showCalls = true;


    option.orders = [];

    // option.dates = [];
    option.dates = dates;
    // console.log(dates);
    option.date = option.dates[0];

    option.loading = false;

    option.showPuts = function () {
      option.showCalls = false;
      console.log(option.showCalls);
    }

    option.hidePuts = function () {
      option.showCalls = true;
      console.log(option.showCalls);
    }

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

      var getOptions = OptionCalculator.getOptions(option.ticker, option.date.value).then(function (response) {


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
        type: "Call",
        expiration: option.date.content
      };
      option.orders.push(order);
      option.data  = [];

      // option.buildGraph(54, option.orders);
      option.buildGraph(parseFloat(option.quote), option.orders);

    }

    option.buyPut = function (equity) {
      option.orderBook = true;
      var order = {
        side: "Buy",
        call: false,
        buy: true,
        strike: parseFloat(equity[0].strong.a.content),
        premium: parseFloat(equity[3].div.content),
        type: "Put",
        expiration: option.date.content
      };

      option.orders.push(order);
      option.data  = [];

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
        type: "Call",
        expiration: option.date.content
      };
      option.orders.push(order);
      option.data  = [];
      option.buildGraph(parseFloat(option.quote), option.orders);
    }

    option.sellPut = function (equity) {
      option.orderBook = true;
      var order = {
        side: "Sell",
        call: false,
        buy: false,
        strike: parseFloat(equity[0].strong.a.content),
        premium: parseFloat(equity[4].div.content),
        type: "Put",
        expiration: option.date.content
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
      console.log(option.date.value);
      option.loading = true;
      OptionCalculator.getOptions(option.ticker, option.date.value).then(function (response) {

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

      OptionCalculator.getPutOptions(option.ticker, option.date.value).then(function (response) {

        var newResponse = [];

        for (var i = 0; i < response.td.length; i+=10) {
          var test = response.td.slice(i, i+10);
          // console.log(i);
          // console.log(test);
          newResponse.push(test);
        }
        option.loading = false;
        option.puts = newResponse;
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
          // console.log('the call ran', option.quote, options[i].strike, options[i].premium);
          // console.log(profit);
        } else if (!options[i].buy && options[i].call){
          profit = profit + OptionCalculator.writtenCallOptionProfitLoss(stock, options[i].strike, options[i].premium);
          // console.log('the non call ran');
        } else if (options[i].buy && !options[i].call){
          profit = profit + OptionCalculator.putOptionProfitLoss(stock, options[i].strike, options[i].premium);

        } else if (!options[i].buy && !options[i].call){
          profit = profit + OptionCalculator.writtenPutOptionProfitLoss(stock, options[i].strike, options[i].premium);
        }
      }
      // console.log("Profit: " + profit);
      return profit;

    }

    // function buildBlackScholesDataSet(stock, options) {
    //   // options, puts, stock
    //
    //   var profit = 0;
    //
    //
    //   for (var i = 0; i < options.length; i++) {
    //     var blackScholesPrice = OptionCalculator.black_scholes(true, stock, options[i].strike, 0, .65, 1/365)
    //
    //     // console.log(options[i].strike, options[i].premium, stock);
    //     if (options[i].buy && options[i].call){
    //       profit = profit + blackScholesPrice - options[i].premium;
    //       // console.log('the call ran', option.quote, options[i].strike, options[i].premium);
    //       // console.log(profit);
    //     } else if (!options[i].buy && options[i].call){
    //       profit = profit - blackScholesPrice + options[i].premium;
    //       // console.log('the non call ran');
    //     }
    //   }
    //   // console.log("Profit: " + profit);
    //   return profit;
    //
    // }



    option.buildGraph = function (stock, options) {
      console.log(options);


      for (var i = -10; i < 20; i+= 0.01000) {

        var newStock = Math.round((stock+i)*100)/100;
        // console.log(newStock);

        // console.log(OptionCalculator.black_scholes(true, newStock, options[0].strike, 0, .65, 1/365));


        // var dataSet = {
        // x: stock + i,
        // val_0: buildDataSet(stock + i, options) * 100,
        // val_1: 0,
        // val_2: 0,
        // val_3: 0
        // }

        // buildBlackScholesDataSet(newStock, options) * 100

        var dataSet = {
        x: newStock,
        val_0: buildDataSet(newStock, options) * 100,
        val_1: 0,
        val_2: 0,
        val_3: 0
        }
        option.data.push(dataSet);
        // console.log(dataSet);
      }
    }


    option.screenshot = function () {
      element = document.getElementById("option-chart");
      html2canvas(element, {
        onrendered: function(canvas) {
          document.body.appendChild(canvas);
          console.log(canvas.toDataURL());
        }
      });
      console.log("option screen shot pressed");
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
        },
        // {
        //   y: "val_2",
        //   label: "Black Scholes 18 Days",
        //   color: "#3366FF",
        //   drawDots: false
        // }
      ],
    };





  });
