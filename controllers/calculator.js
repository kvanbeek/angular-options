angular
  .module('itunes-search-app')
  .controller('CalculatorController', function(OptionCalculator) {
    // console.log(artist, $routeParams);


    var option = this;
    option.greeks = false;



    option.getValues = function () {
      option.greeks = true;
      console.log("ran get values");
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




















  });
