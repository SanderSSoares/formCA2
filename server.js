
// Read csv data, separate each word and but at the right place on the data base 

// index.js
const csvData = `"John", "Doe","johndoe@example.com", "0893216548", "1YR5DD"
"Jane", "Smith","janesmith@example.com", "0892856548", "8MH7WE"
"Michael", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"Tommy", "Bean","tommybean@example.com", "0894859612", "EYR5DD"`;

//call the database  setup havig access to all its modules 
var database = require('./database');

const connection = database.connection; // import the connection




// check if the  inserted record is an invalid  input and is  missing any attribute 
function isValidRecord(record) {
  return (
    record.first_name !== undefined &&// check if the information isn't null
    record.surname !== undefined &&
    record.email !== undefined &&
    record.phone_number !== undefined &&
    record.eircode !== undefined
  );
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
    if (isValidRecord(record)) { // if the record is valid it will be added to the valid records array 
        validRecords.push(record);// add the atribute to the last index on the array 

    } else { // otherwise  run the function to trow an error showing the exactly index 
        throwValidationError(index);
    }
  });

  return validRecords;// return the records which are valid 
}


 // function to throw and error showing the index where it happend 
 function throwValidationError(index) {
  throw new Error(`Validation failed for record at index ${index}`);
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
            res.redirect("/form.html");
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