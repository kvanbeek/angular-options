angular
  .module('itunes-search-app')
  .factory('OptionCalculator', function($http) {
    return {

      probability: function(price, target, days, volatility) {

        var p = price;
        var q = target;
        var t = days / 365;
        var v = volatility;

        var vt = v*Math.sqrt(t);
        var lnpq = Math.log(q/p);

        var d1 = lnpq / vt;

        var y = Math.floor(1/(1+.2316419*Math.abs(d1))*100000)/100000;
        var z = Math.floor(.3989423*Math.exp(-((d1*d1)/2))*100000)/100000;
        var y5 = 1.330274*Math.pow(y,5);
        var y4 = 1.821256*Math.pow(y,4);
        var y3 = 1.781478*Math.pow(y,3);
        var y2 = 0.356538*Math.pow(y,2);
        var y1 = 0.3193815*y;
        var x = 1-z*(y5-y4+y3-y2+y1);
        x = Math.floor(x*100000)/100000;

        if (d1<0) {x=1-x};

        var pbelow = Math.floor(x*1000)/10;
        var pabove = Math.floor((1-x)*1000)/10;

        return [pbelow,pabove];
      },

      probabilityAbove: function(price, target, days, volatility) {
        return this.probability(price, target, days, volatility)[1];
      },

      ndist: function(z){
        return (1.0/(Math.sqrt(2*Math.PI)))*Math.exp(-0.5*z);
      },

      N: function (z) {
        b1 =  0.31938153;
        b2 = -0.356563782;
        b3 =  1.781477937;
        b4 = -1.821255978;
        b5 =  1.330274429;
        p  =  0.2316419;
        c2 =  0.3989423;
        a=Math.abs(z);
        if (a>6.0) {return 1.0;}
        t = 1.0/(1.0+a*p);
        b = c2*Math.exp((-z)*(z/2.0));
        n = ((((b5*t+b4)*t+b3)*t+b2)*t+b1)*t;
        n = 1.0-b*n;
        if (z < 0.0) {n = 1.0 - n;}
        return n;
      },

      black_scholes: function(call,S,X,r,v,t){

        // call = Boolean (to calc call, call=True, put: call=false)
        // S = stock prics, X = strike price, r = no-risk interest rate
        // v = volitility (1 std dev of S for (1 yr? 1 month?, you pick)
        // t = time to maturity

        // define some temp vars, to minimize function calls
          var sqt = Math.sqrt(t);
          var Nd2;  //N(d2), used often
          var nd1;  //n(d1), also used often
          var ert;  //e(-rt), ditto
          var delta;  //The delta of the option

          d1 = (Math.log(S/X) + r*t)/(v*sqt) + 0.5*(v*sqt);
          d2 = d1 - (v*sqt);
          // console.log(call);
          if (call) {
            delta = this.N(d1);
            Nd2 = this.N(d2);
          } else { //put
            console.log('this is a put');
            delta = -this.N(-d1);
            Nd2 = -this.N(-d2);
          }

          ert = Math.exp(-r*t);
          nd1 = this.ndist(d1);

          gamma = nd1/(S*v*sqt);
          vega = S*sqt*nd1;
          theta = -(S*v*nd1)/(2*sqt) - r*X*ert*Nd2;
          rho = X*t*ert*Nd2;

          // console.log(delta);
          // console.log(gamma);
          // console.log(vega);
          // console.log(theta);
          // console.log(rho);

          optionsPrice = S*delta-X*ert *Nd2;

          var optionsData = {
            price: optionsPrice,
            delta: delta,
            gamma: gamma,
            vega: vega,
            theta: theta,
            rho: rho
          };



          // return ( S*delta-X*ert *Nd2);
          return optionsPrice;

      },

      getOptions: function(ticker, date) {

        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fop%3Fs%3D" + ticker + "%26date%3D" + date + "'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22optionsCallsTable%22%5D%2Fdiv%5B2%5D%2Fdiv%2Ftable%2Ftbody%2Ftr%2Ftd'&format=json&diagnostics=true&callback="
  			// var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fop%3Fs%3D' + ticker + '%2BOptions%27%20and%20xpath%3D%27%2F%2F*%5B%40id%3D%22optionsCallsTable%22%5D%2Fdiv%5B2%5D%2Fdiv%2Ftable%2Ftbody%2Ftr%2Ftd%27&format=json&diagnostics=true&callback=';
  			var promise = $http.get(url);
        console.log('running get options');
  			// return promise;
  			return promise.then(function(response) {
          // console.log(response);
  				return response.data.query.results;
  			});
  		},

      getPutOptions: function(ticker, date) {

        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fop%3Fs%3D" + ticker + "%26date%3D" + date + "'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22optionsPutsTable%22%5D%2Fdiv%5B2%5D%2Fdiv%2Ftable%2Ftbody%2Ftr%2Ftd'&format=json&diagnostics=true&callback="
  			// var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fop%3Fs%3D' + ticker + '%2BOptions%27%20and%20xpath%3D%27%2F%2F*%5B%40id%3D%22optionsCallsTable%22%5D%2Fdiv%5B2%5D%2Fdiv%2Ftable%2Ftbody%2Ftr%2Ftd%27&format=json&diagnostics=true&callback=';
  			var promise = $http.get(url);
        console.log('running get options');
  			// return promise;
  			return promise.then(function(response) {
          // console.log(response);
  				return response.data.query.results;
  			});
  		},

      getQuote: function(ticker){
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%20%28%22" + ticker + "%22%29&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env";
  			var promise = $http.get(url);
        console.log('running get quote');
  			// return promise;
  			return promise.then(function(response) {
          // console.log(response);
  				return response.data.query.results;
  			});
      },

      getDates: function(ticker){
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fop%3Fs%3D" + ticker + "%2BOptions'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22options_menu%22%5D%2Fform%2Fselect%2Foption%2F%40value'&format=json&diagnostics=true&callback=";
  			var promise = $http.get(url);
        console.log('running get quote');
  			// return promise;
  			return promise.then(function(response) {
          // console.log(response);
  				return response.data.query.results;
  			});
      },

      callOptionProfitLoss: function (stock, strike, premium) {
        var breakeven = strike + premium;
        // return stock - breakeven;
        if ((stock - breakeven) > -premium) {
          return stock - breakeven;
        }else{
          return -premium;
        }
      },

      putOptionProfitLoss: function (stock, strike, premium) {
        var breakeven = strike - premium;
        // return breakeven - stock;

        if ((breakeven - stock) > -premium) {
          return breakeven - stock
        }else{
          return -premium;
        }

      },

      writtenPutOptionProfitLoss: function (stock, strike, premium){
        var breakeven = strike - premium;

        if (stock > (strike - premium)){
          return Math.min(premium - (strike - stock), premium);
        }else{
          return -(strike - stock - premium);
        }

      },

      writtenCallOptionProfitLoss: function (stock, strike, premium){
        var breakeven = strike + premium;

        if (stock > (strike + premium)){
          return -(stock - strike - premium);
        }else{
          // return Math.min(premium - (strike - stock), premium);
          return Math.min(premium + (strike - stock), premium);
        }

      },

      expectedMove: function (atmCall, atmPut, otmCall, otmPut) {
        return (atmCall + atmPut + otmCall + otmPut) / 2;
      },

      probabilityOfSuccess: function () {

      },







    };
  });
