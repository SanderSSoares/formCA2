//Form-validation.js
//This validation will work when opening the form.html from the folder, what is different than accessing localhod:3000
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the form from submitting until validation is complete
  
      // Validate each field
      const firstName = document.getElementById('first_name');
      const surname = document.getElementById('surname');
      const phone = document.getElementById('phone_number');
      const eircode = document.getElementById('eircode');
      let valid = true;
  
      // uses regular expression to Validate First and Second Name (alphanumeric, max 20 characters)
      if (!/^[A-Za-z0-9]{1,20}$/.test(firstName.value)) {// test if the user input is compatible with the regex , if not equal sends alert 
        alert('First Name is invalid.'); 
        valid = false;
      }
      if (!/^[A-Za-z0-9]{1,20}$/.test(surname.value)) {
        alert('Second Name is invalid.');
        valid = false;
      }
  
      // Validate Phone (numeric, 10 characters)
      if (!/^\d{10}$/.test(phone.value)) {
        alert('Phone number is invalid.');
        valid = false;
      }
  
      // Validate Eircode (starts with number, alphanumeric, 6 characters)
      if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode.value)) {
        alert('Eircode is invalid.');
        valid = false;
      }
    });
  });
  