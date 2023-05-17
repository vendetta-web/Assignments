import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import getCurrencyConversionRate from '@salesforce/apex/currencyConversionController.getCurrencyConversionRate'

export default class ExternalApi extends LightningElement {
    @track fromCurrency = '';
    @track toCurrency = '';
    @track amount = '';
    @track conversionRate = '';
    @track convertedAmount = '';
    @track loading = false;
    @track errorMessage = '';
    currencyOptions = [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'JPY', value: 'JPY' },
    ];

    handleFromCurrencyChange(event) {
        this.fromCurrency = event.target.value;
    }

    handleToCurrencyChange(event) {
        this.toCurrency = event.target.value;
    }

    handleAmountChange(event) {
        this.amount = event.target.value;
    }

    handleConvert() {
        if (this.fromCurrency && this.toCurrency) {
            this.loading = true;
            this.conversionRate = '';
            this.convertedAmount = '';
            this.errorMessage = '';

            const apiUrl = `https://v6.exchangerate-api.com/v6/61106b806606c272cc0d880f/latest/${this.fromCurrency}`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    if (data.conversion_rates && data.conversion_rates[this.toCurrency]) {
                        this.conversionRate = data.conversion_rates[this.toCurrency];

                        if (this.amount) {
                            this.convertedAmount = this.amount * this.conversionRate;
                        }
                    } else {
                        this.errorMessage = 'Invalid currency codes.';
                    }
                })
                .catch((error) => {
                    this.errorMessage = 'An error occurred while fetching the conversion rate.';
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please enter both currency codes.',
                    variant: 'error',
                })
            );
        }
    }
}