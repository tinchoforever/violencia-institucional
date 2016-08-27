'use strict';
describe('Service :: Config', function(){
  beforeEach(module('trunk'));
  describe(':: Env param',function(){
    var httpBackend,injector;
    beforeEach(inject(function ($injector,$httpBackend) {
      httpBackend = $httpBackend;
      injector = $injector;
      $httpBackend.whenGET(/.*\/main\.html.*/)
        .respond('<div></div>');

      $httpBackend.whenGET(/.*\/config.*/)
        .respond(
          '{"flexITP": {"flexCharts": {"flexChartsURL": "https://trade.loginandtrade.com/tp/charts","ratesUrl": "pushpreprod.cityindextest9.co.uk","ratesUrlControlPort": "443","ratesUrlPort": "443","historicUrl": "https://ciapipreprod.cityindextest9.co.uk/tradingapi/","marketSearchUrl": "https://ciapipreprod.cityindextest9.co.uk/tradingapi/"},"tradingApiURL": "https://ciapipreprod.cityindextest9.co.uk/tradingapi/","vsClientProxy": "http://ciapipreprod.cityindextest9.co.uk/ClientDocumentsProxy/ClientProxy","viewStWebApp": "http://pkh-ppe-web01/flashASP/host/progs/ViewStatement/ViewStatement","onlineFundinghtm": "OnlineFundingView/transferfunds","onlineFundingWebApp": "https://qappitp.cityindex.co.uk/onlineFundingPCI","lsc": {"serverURL": "pushpreprod.cityindextest9.co.uk","controlPort": "443","port": "443"}}}');
    }));

    it(':: Undefined',function(){
      var service = injector.get('ConfigSrv');
      var srvUrl;
      service.getKeyValue('SrvUrl').then(function(_srvUrl){
        srvUrl = _srvUrl;
      });
      httpBackend.flush();
      expect(srvUrl).toBe('https://ciapipreprod.cityindextest9.co.uk/tradingapi/');
    })

    it(':: Defined',function(){
      var paramsSrv = injector.get('ParamsSrv');
      paramsSrv.ENV = 'live';
      var service = injector.get('ConfigSrv');
      var srvUrl;
      service.getKeyValue('SrvUrl').then(function(_srvUrl){
        srvUrl = _srvUrl;
      });
      httpBackend.flush();
      expect(srvUrl).toBe('https://ciapipreprod.cityindextest9.co.uk/tradingapi/');
    })

    it(':: Defined at PPE',function(){
      var paramsSrv = injector.get('ParamsSrv');
      paramsSrv.ENV = 'ppe';
      var service = injector.get('ConfigSrv');
      var srvUrl;
      service.getKeyValue('SrvUrl').then(function(_srvUrl){
        srvUrl = _srvUrl;
      });
      httpBackend.flush();
      expect(srvUrl).toBe('https://ciapipreprod.cityindextest9.co.uk/tradingapi/');
    })
  })
});
