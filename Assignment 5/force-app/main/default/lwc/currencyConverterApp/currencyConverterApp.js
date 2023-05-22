import { LightningElement, api, track } from 'lwc';
import { countryCodeList } from 'c/countryCodeList'
export default class CurrencyConverterApp extends LightningElement {
  @api headerText = 'Default Header Text';
  @api conversionRateColor = 'black';
  @api backgroundColor = 'white';
  @api decimalPlaces = 2;
  @track conversionRate = 0.0;
  @track result = '';
  countryList = countryCodeList
  countryFrom = "USD"
  countryTo = "AUD"
  amount = ''
  result
  error


  get backgroundStyle() {
    return `background-color: ${this.backgroundColor}`;
  }

  get conversionRateStyle() {
    return `color: ${this.conversionRateColor}`;
  }

  get formattedConversionRate() {
    return this.conversionRate.toFixed(this.decimalPlaces);
  }

  get formattedResult() {
    return parseFloat(this.result).toFixed(this.decimalPlaces);
  }

  handleChange(event) {
    const { name, value } = event.target
    console.log("name", name)
    console.log("value", value)
    this[name] = value
    this.result = ''
    this.error = ''
  }
  submitHandler(event){
    event.preventDefault()
    this.convert()
  }
   convert(){
    const API_URL = `https://api.exchangerate.host/convert?from=${this.countryFrom}&to=${this.countryTo}`
      fetch(API_URL)
      .then(resolve => resolve.json())
      .then(jsonData => {
        this.result = (Number(this.amount) * jsonData.result).toFixed(2);
        console.log(jsonData.result);

      })
    }
}