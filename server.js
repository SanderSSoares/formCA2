

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
 
}}
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

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));// app method to encode the url  and only access those which matches the requirement
app.use(checkPort);
app.use(checkDatabaseSchema);

app.get('/', function(req,res){

    res.sendFile(path.join(__dirname, 'form.html'));
});
//search for css
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/style.css');
});
// run a function to submit the informations to the data base , after the information being validate 
app.post('/submit', function(req, res){

    const {first_name, surname, email, phone_number, eircode}  = req.body;

    if (!/^[A-Za-z0-9]{1,20}$/.test(first_name)) {
        return res.send("First Name must be alphanumeric, less than 20 characters.");  
      }

      if (!/^[A-Za-z0-9]{1,20}$/.test(surname)) {
        return res.send("Surname must be alphanumeric, less than 20 characters.");
      }
        
      // create a variable with the regular expressions to require elements from an email 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { // test if the user input and the regex variable are compatible, if not it return an erro message  
        return res.send("Please enter a valid email address!");
      }
          // using regex test if the phone is numeric and has 10 digits  if not compatible send erro message 
      if (!/^\d{10}$/.test(phone_number)) {
        return res.send("Phone number must have only numbers up to 10 digits.");
      }
       // regex to check if the iercode starts with a number and  contanit only number and letters Capital or not, and contais 6 digits 
      if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode)) {
        return res.send("Eircode must start with a number,and must has up to 6 digits.");
      }
    if(first_name && surname && email && phone_number && eircode){// if every input is valid  run the folowing code
        // inserts the inputs into the  data base 
        const sql = "INSERT INTO mysql_table (first_name, surname, email, phone_number, eircode) VALUES(?, ?, ?, ?, ?)";
        connection.query(sql, [first_name, surname, email, phone_number, eircode], function(err, results){
         // if not able to add to the data base return the error response 
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Error: Could not insert data into the database");
            }
           //Otherwise, display that form was submitted successfully!
           res.send("Form submitted successfully!");
        });
    }else{

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

// Middleware for Checking Port
function checkPort(req, res, next) {
  const port = 3000; // Specify the port you want to check
  const isPortOpen = require('is-port-reachable');

  isPortOpen(port, { host: 'localhost' }).then((open) => {
    if (open) {
      next(); // Port is open, proceed to the next middleware
    } else {
      res.status(500).send('Error: The specified port is not open.');
    }
  });
}

// Middleware for Database Schema Check
function checkDatabaseSchemaFunction(req, res, next) {
  const requiredTable = 'mysql_table'; // Specify your required table name
  const requiredColumns = ['first_name', 'surname', 'email', 'phone_number', 'eircode']; // Specify your required columns

  const query = `
    SELECT TABLE_NAME, COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = ? AND COLUMN_NAME IN (?)
  `;

  connection.query(query, [requiredTable, requiredColumns], (err, results) => {
    if (err) {
      console.error('Error checking database schema:', err);
      res.status(500).send('Error checking database schema.');
      return;
    }

    const missingColumns = requiredColumns.filter((column) =>
      results.every((result) => result.COLUMN_NAME !== column)
    );

    if (missingColumns.length === 0) {
      next(); // Database schema is valid, proceed to the next middleware
    } else {
      res.status(500).send(`Error: Missing columns in the database schema: ${missingColumns.join(', ')}.`);
    }
  });
}

// Middleware for Database Schema Check
function checkDatabaseSchema(req, res, next) {
  // Assuming you have a function to check the database schema
  const isDatabaseSchemaValid = checkDatabaseSchemaFunction();

  if (isDatabaseSchemaValid) {
    next(); // Database schema is valid, proceed to the next middleware
  } else {
    res.status(500).send('Error: The database schema is not valid.');
  }
}