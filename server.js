
// Read csv data, separate each word and but at the right place on the data base 

// index.js
const csvData = `"John", "Doe","johndoe@example.com", "0893216548", "1YR5DD"
"Jane", "Smith","janesmith@example.com", "00892856548", "8MH7WE"
"Michael", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"victor", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"carlos", "Johnson","michaeljohnson@example.com", "90898523694", "7RP0RR"
"marcelo", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"Tommy", "Bean","tommybean@example.com", "0894859612", "yYR5DD"`;

//call the database  setup havig access to all its modules 
var database = require('./database');

const connection = database.connection; // import the connection




// check if the  inserted record is an invalid  input and is  missing any attribute 
function isValidRecord(record) {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

 // Regular Expressions  to validate each field before adding it to the database 
  
  if(!/^[A-Za-z0-9]{1,20}$/.test(record.first_name)||// check if the name is alfanumeric with 20 digits 
  !/^[A-Za-z0-9]{1,20}$/.test(record.surname)||
  !emailRegex.test(record.email)|| // check if contains all elements of an email 
  !/^\d{10}$/.test(record.phone_number)|| // check if phone has 10 digits 
  !/^[0-9][A-Za-z0-9]{5}$/.test(record.eircode)) {     // check if ier code starts with number and has 10 digits 
    // logs to the terminal when error is found 
console.log('this contains invalid values please check the inputs at the following index');
// if any field doesan't pass set valid boolean to be false  
 valid = false; 


  }else{
    return valid;
 
}

  
}


// function to split the data by the " , " will be called in the validation function
function parseCSVData(csvString) { // take as paramether any csvString
  const lines = csvString.split('\n'); // split the string is lines 

  const records = lines.map((line) => {//makes a map whith the lines 
    const fields = line.split(','); // split each word of the line by the " , "

      const first_name = fields[0].replace(/"/g, '').trim(); // instantiate each atribute to the right place replacicing every comma by a "" and trim the space
      const surname = fields[1].replace(/"/g, '').trim();
      const email = fields[2].replace(/"/g, '').trim();
      const phone_number = fields[3].replace(/"/g, '').trim();
      const eircode = fields[4].replace(/"/g, '').trim();

    return { first_name, surname, email, phone_number, eircode };// return each item separated 
  });
  // return  records as a map of all the lines 
  return records;
}




// function to validate csv data, and split it calling a function, after validate  and insert it into a array,
// or throw an error showing the index for the file 
function validateCSVData(csvData) {
  const validRecords = []; // create the array 

  // instantiate the function  to parce data, using as paramether any csvData 
  const parsedData = parseCSVData(csvData);

  parsedData.forEach((record, index) => { // give a index for each of the String  of the parsed data 
    if (isValidRecord(record)==true) { // uses the validation function to see if the record is valid so it will be added to the valid records array 
        validRecords.push(record);// add the atribute to the last index on the array 

    } else { // otherwise if function  return is false  run the function to throw an error showing the exactly index 
        throwValidationError(index);
    }
  });

  return validRecords;// return the records which are valid 
}


 // function to throw and error showing the index where it happend 
 function throwValidationError(index) {
  console.log(`Validation failed for record at index  ${index}`);
 // throw new Error(`Validation failed for record at index ${index}`); 
}





// try and catch for handlying error 
try {
  // instantiate the validaCSV data methop that parces the csv data and validate it 
 const validatedData = validateCSVData(csvData);
 // show the validated data in the console 
 console.log('Validated Data:', validatedData);

 // creates the connection with the data base 
database.createDatabaseConnection();
 //insert valid records in the data base  and close the connection 
 database.insertValidRecords(validatedData, () => {
   
 });
 // catch any error and show a message 
} catch (error) {
 console.error('Error:', error.message);
}



















// importing the libraries to be used in the project 
// import the express package framework instantiating it 
var express = require("express");

var app = express();// call the method  using  setting to the variable app that have access to all functions and modules of the express framework 


var path = require('path');
//Setting up a static middleware to serve files from the public directory
//We had to set it to public, because for some reason it was not working
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));// app method to encode the url  and only access those which matches the requirement

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'form.html'));
});
//After the first forms being submitted, the css formating was gone, so below structure was adopted
//Defining a route for serving the style.css file
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');//Setting the response header for CSS content
  res.sendFile(__dirname + '/style.css');//Sending the style.css file
});




// run a function to submit the informations to the data base , after the information being validate 
app.post('/submit', function(req, res){
    //Extract form data from the request body
    const {first_name, surname, email, phone_number, eircode}  = req.body;
    //Here we started the validation of the data
    //FIrst name must be alphanumeric and of length 20 characters max.
    if (!/^[A-Za-z0-9]{1,20}$/.test(first_name)) {
        return res.send("First Name must be alphanumeric, less than 20 characters.");//Display message in case user inputs wrong data
      }
    //FIrst name must be alphanumeric and of length 20 characters max.
      if (!/^[A-Za-z0-9]{1,20}$/.test(surname)) {
        return res.send("Surname must be alphanumeric, less than 20 characters.");//Display message in case user inputs wrong data
      }
        
      // create a variable with the regular expressions to require elements from an email 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { // test if the user input and the regex variable are compatible, if not it return an erro message  
        return res.send("Please enter a valid email address!");
      }
          // using regex test if the phone is numeric and has 10 digits  if not compatible send erro message 
      if (!/^\d{10}$/.test(phone_number)) {
        return res.send("Phone number must have only numbers up to 10 digits.");//Display message in case user inputs wrong data
      }
       // regex to check if the iercode starts with a number and  contanit only number and letters Capital or not, and contais 6 digits 
      if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode)) {
        return res.send("Eircode must start with a number,and must has up to 6 digits.");//Display message in case user inputs wrong data
      }
      //If all validation passes, insert form data into our database 
    if(first_name && surname && email && phone_number && eircode){
        //Declaring sql variable that uses sql statement to insert into our table pior created
         // if not able to add to the data base return the error response 
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Error: Could not insert data into the database");
            //Otherwise, display that form was submitted successfully!
            res.send("Form submitted successfully!");
        });
    }else{
      //In case one of the validations go wrong, display also this message
        return res.send("Please try again, make sure all required fields are filled in!")
    }
})
app.get("/form", function (req, res){

    res.sendFile(__dirname + '/form.html');
})

// set the app to listen to the port 3000 and runs a function 
app.listen(3000, function(){

    console.log("App Listening on port 3000 ")
    
   // database.closeDatabaseConnection();
   
})