describe("option calculator service", function() {
  var optioncalculator, $httpBackend;

  beforeEach(module('option-graphs'));
  beforeEach(inject(function($injector) {
    optioncalculator = $injector.get('OptionCalculator');

    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fop%3Fs%3DMSFT%26date%3D1449792000'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22optionsCallsTable%22%5D%2Fdiv%5B2%5D%2Fdiv%2Ftable%2Ftbody%2Ftr%2Ftd'&format=json&diagnostics=true&callback=")
    .respond(200,
      {
        data:  {
          query:  {
            results: [
              {
                div: {
                  class: "option_entry Fz-m",
                  a: {
                  href: "/q?s=MSFT151211C00048000",
                  content: "MSFT151211C00048000"
                  }
                },
                div: {
                  class: "option_entry Fz-m",
                  content: "6.25"
                },
                div: {
                  class: "option_entry Fz-m",
                  content: "6.95"
                },
                div: {
                  class: "option_entry Fz-m",
                  content: "8.25"
                }
              }
            ]
          }
        }
      }
  );


  }));

  it("getOptions() should return an array of divs containing options data", function(){
    optioncalculator.getOptions("MSFT", "1449792000").then(function(response){
      console.log(response);
      expect(response.length).toEqual(4);
      $httpBackend.flush();
    });
  });



  it("black_scholes() should return a black scholes options price", function(){
    var answer = optioncalculator.black_scholes(true, 55.91, 48, 0, .9688, 6);
    var price = parseFloat(answer.price.toFixed(2));
    expect(price).toEqual(8.25);
  });

  it("callOptionProfitLoss() hould return call option profit loss", function(){
    var answer = optioncalculator.callOptionProfitLoss(55.91, 48, 8.25);
    var profit = parseFloat(answer.toFixed(2));
    expect(profit).toEqual(-0.34);
  });

  it("putOptionProfitLoss() hould return call option profit loss", function(){
    var answer = optioncalculator.putOptionProfitLoss(55.91, 48, 0.3);
    var profit = parseFloat(answer.toFixed(2));
    expect(profit).toEqual(-0.3);
  });

  it("writtenCallOptionProfitLoss() should return written call option profit loss", function(){
    var answer = optioncalculator.writtenCallOptionProfitLoss(55.91, 48, 8.25);
    var profit = parseFloat(answer.toFixed(2));
    expect(profit).toEqual(0.34);
  });





});
