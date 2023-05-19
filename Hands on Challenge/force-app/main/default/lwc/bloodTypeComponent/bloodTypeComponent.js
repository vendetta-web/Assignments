import { LightningElement, track } from 'lwc';

export default class BloodTypeComponent extends LightningElement {
  @track bloodType;
  @track bloodGroup;
  @track user;

  fetchBloodType() {
    fetch('https://random-data-api.com/api/v2/blood_types')
      .then((response) => {response.json()
      console.log("datadtadtadtad :"+ JSON.stringify(response))})
      .then((data) => {
        if (data && data.length > 0) {
          this.bloodType = data[0].type;
          this.bloodGroup = data[0].group;
          this.fetchUserInformation();
        } else {
          this.bloodType = null;
          this.bloodGroup = null;
          this.user = null;
        }
      })
      .catch((error) => {
        console.error('Error fetching blood type:', error);
        this.bloodType = null;
        this.bloodGroup = null;
        this.user = null;
      });
  }

  fetchUserInformation() {
    fetch('https://random-data-api.com/api/v2/users')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          this.user = {
            name: data[0].first_name + ' ' + data[0].last_name,
            email: data[0].email
          };
        } else {
          this.user = null;
        }
      })
      .catch((error) => {
        console.error('Error fetching user information:', error);
        this.user = null;
      });
  }
}
