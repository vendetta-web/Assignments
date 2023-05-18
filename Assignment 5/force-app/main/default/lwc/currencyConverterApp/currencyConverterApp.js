import { LightningElement } from 'lwc';
import {countryCodeList} from 'c/countryCodeList'
export default class CurrencyConverterApp extends LightningElement {
  countryList = countryCodeList
  countryFrom = "USD"
  countryTo = "AUD"
  amount =''
  result
  error 
  handleChange(event){
    const {name, value} = event.target
    console.log("name", name)
    console.log("value", value)
    this[name] = value
    this.result=''
    this.error =''
  }
  // submitHandler(event){
  //   event.preventDefault()
  //   this.convert()
  // }
  //  convert(){
  //   const API_URL = `https://api.exchangerate.host/convert?from=${this.countryFrom}&to=${this.countryTo}`
  //     fetch(API_URL)
  //     .then(resolve => resolve.json())
  //     .then(jsonData => {
  //       this.result = (Number(this.amount) * jsonData.result).toFixed(2);
  //       console.log(jsonData.result);

  //     })
     
  // }

  async submitHandler(event) {
    event.preventDefault();
    try {
      await this.convert();
    } catch (error) {
      console.log(error);
      this.error = "An error occurred. Please try again...";
    }
  }
  
  async convert() {
    const API_URL = `https://api.exchangerate.host/convert?from=${this.countryFrom}&to=${this.countryTo}`;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }
      const jsonData = await response.json();
      if (jsonData.success !== true) {
        throw new Error("API request unsuccessful");
      }
      const conversionRate = jsonData.result;
      if (typeof conversionRate !== "number") {
        throw new Error("Invalid conversion rate");
      }
      this.result = (Number(this.amount) * conversionRate).toFixed(2);
      console.log(this.result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
}