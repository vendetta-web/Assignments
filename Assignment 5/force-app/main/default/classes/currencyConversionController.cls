public with sharing class currencyConversionController {
    public class ConversionResult {
        @AuraEnabled
        public String fromCurrency { get; set; }
        @AuraEnabled
        public String toCurrency { get; set; }
        @AuraEnabled
        public Decimal amount { get; set; }
        @AuraEnabled
        public Decimal convertedAmount { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static ConversionResult getCurrencyConversionRate(String fromCurrency, String toCurrency, Decimal amount) {
        ConversionResult result = new ConversionResult();
        result.fromCurrency = fromCurrency;
        result.toCurrency = toCurrency;
        result.amount = amount;
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://api.exchangerate-api.com/v4/latest/' + fromCurrency);
        request.setMethod('GET');

        HttpResponse response = new Http().send(request);
        if (response.getStatusCode() == 200) {
            Map<String, Object> responseData = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            Map<String, Object> rates = (Map<String, Object>) responseData.get('rates');
            Decimal conversionRate = (Decimal) rates.get(toCurrency);
            if (conversionRate != null) {
                result.convertedAmount = amount * conversionRate;
            }
        }

        return result;
    }
}