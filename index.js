 // function to fetch data from the API
 function fetchData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.log(error));
}

// Account dialog
function openAccount(){
const accountOpenBtn = document.getElementById('accountOpenBtn');
const accountDialog = document.getElementById('accountDialog');
const closeAccountBtn = document.getElementById('closeAccountBtn');
const overlay = document.getElementById('overlay');

accountOpenBtn.addEventListener('click', () => {
    fetchData('https://random-data-api.com/api/users/random_user')
        .then(data => {
            document.getElementById('firstName').textContent = 'First Name: ' + data.first_name;
            document.getElementById('lastName').textContent = 'Last Name: ' + data.last_name;
            document.getElementById('username').textContent = 'Username: ' + data.username;
            document.getElementById('email').textContent = 'Email: ' + data.email;
            document.getElementById('address').textContent = 'Address:'
            document.getElementById('street_address').textContent = '' + (data.address.street_address);
            document.getElementById('city').textContent = '' + (data.address.city);
            document.getElementById('state').textContent = '' + (data.address.state);
            document.getElementById('country').textContent = '' + (data.address.country);
            document.getElementById('zip_code').textContent = '' + (data.address.zip_code);
        });

    showDialog(accountDialog);
    hideDialog(submitLeadDialog);
});

closeAccountBtn.addEventListener('click', () => {
    hideDialog(accountDialog);
});

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.dialog.active')
    modals.forEach(dialog => {
        hideDialog(accountDialog);
        hideDialog(submitLeadDialog);
    })
})
}
openAccount();


// Submit Lead dialog
function openLead(){
    const submitOpenBtn = document.getElementById('submitOpenBtn');
const submitLeadDialog = document.getElementById('submitLeadDialog');
const cancelLeadBtn = document.getElementById('cancelLeadBtn');
const submitLeadBtnForm = document.getElementById('submitLeadBtnForm');
const leadForm = document.getElementById('leadForm');

submitOpenBtn.addEventListener('click', () => {
    resetLeadForm();
    showDialog(submitLeadDialog);
    hideDialog(accountDialog);
});

cancelLeadBtn.addEventListener('click', () => {
    hideDialog(submitLeadDialog);
});

leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Perform form validation
    if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
    }

    // Form submission successful
    showAlert('Submitted!');
    //close the form after getting submitted
    hideDialog(submitLeadDialog);
    //For reset the form getting the alert msg
     resetLeadForm();
});
};
openLead();


function resetLeadForm() {
    leadForm.reset();
}

function showDialog(dialog) {
    if (dialog == null) return
    dialog.style.display = 'block';
    overlay.style.display = 'block';
    dialog.classList.add('active')
    overlay.classList.add('active')
}

function hideDialog(dialog) {
    if (dialog == null) return
    dialog.classList.remove('active')
    overlay.classList.remove('active')
    dialog.style.display = 'none';
    overlay.style.display = 'none';
}

function showAlert(message) {
    alert(message);
}