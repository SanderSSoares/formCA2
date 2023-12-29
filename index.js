// Read csv data, separate each word, and insert at the right place in the database
const csvData = `"John", "Doe","johndoe@example.com", "0893216548", "1YR5DD"
"Jane", "Smith","janesmith@example.com", "00892856548", "8MH7WE"
"Michael", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"victor", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"carlos", "Johnson","michaeljohnson@example.com", "90898523694", "7RP0RR"
"marcelo", "Johnson","michaeljohnson@example.com", "0898523694", "7RP0RR"
"Tommy", "Bean","tommybean@example.com", "0894859612", "yYR5DD"`;

// Import the database setup having access to all its modules
var database = require('./database');
const connection = database.connection; // Import the connection

// Check if the inserted record is an invalid input and is missing any attribute
function isValidRecord(record) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

  // Regular Expressions to validate each field before adding it to the database
  if (
    !/^[A-Za-z0-9]{1,20}$/.test(record.first_name) ||
    !/^[A-Za-z0-9]{1,20}$/.test(record.surname) ||
    !emailRegex.test(record.email) ||
    !/^\d{10}$/.test(record.phone_number) ||
    !/^[0-9][A-Za-z0-9]{5}$/.test(record.eircode)
  ) {
    // Logs to the terminal when an error is found
    console.log('This contains invalid values. Please check the inputs at the following index');
    // If any field doesn't pass, set the valid boolean to be false
    valid = false;
  } else {
    return valid;
  }
}

// Function to split the data by the ",", will be called in the validation function
function parseCSVData(csvString) {
  const lines = csvString.split('\n'); // Split the string into lines

  const records = lines.map((line) => {
    // Makes a map with the lines
    const fields = line.split(','); // Split each word of the line by the ","

    const first_name = fields[0].replace(/"/g, '').trim(); // Instantiate each attribute in the right place, replacing every comma with "" and trimming the space
    const surname = fields[1].replace(/"/g, '').trim();
    const email = fields[2].replace(/"/g, '').trim();
    const phone_number = fields[3].replace(/"/g, '').trim();
    const eircode = fields[4].replace(/"/g, '').trim();

    return { first_name, surname, email, phone_number, eircode }; // Return each item separated
  });
  // Return records as a map of all the lines
  return records;
}
// Function to validate CSV data, split it, call a function after validation, and insert it into an array,
// or throw an error showing the index for the file
function validateCSVData(csvData) {
  const validRecords = []; // Create the array
  // Instantiate the function to parse data, using any csvData as a parameter
  const parsedData = parseCSVData(csvData);
  parsedData.forEach((record, index) => {
    // Give an index for each of the strings of the parsed data
    if (isValidRecord(record) == true) {
      // Use the validation function to see if the record is valid, so it will be added to the valid records array
      validRecords.push(record); // Add the attribute to the last index on the array
    } else {
      // Otherwise, if the function return is false, run the function to throw an error showing the exactly index
      throwValidationError(index);
    }
  });
  return validRecords; // Return the records which are valid
}
// Function to throw an error showing the index where it happened
function throwValidationError(index) {
  console.log(`Validation failed for record at index ${index}`);
  // throw new Error(`Validation failed for record at index ${index}`);
}

// Function to check if the database schema is correct
function checkDatabaseSchema(callback) {
  // Query to check if the table exists
  const checkTableQuery = "SHOW TABLES LIKE 'mysql_table';";
  connection.query(checkTableQuery, (err, results) => {
    if (err) {
      console.error('Error checking database schema:', err.message);
      callback(false);
      return;
    }
    // Check if the table exists
    const tableExists = results.length > 0;
    if (!tableExists) {
      console.error('Error: Table "mysql_table" does not exist.');
      callback(false);
      return;
    }
    // If all checks pass, the schema is valid
    callback(true);
  });
}

try {
  // Instantiate the validateCSVData method that parses the CSV data and validates it
  const validatedData = validateCSVData(csvData);
  // Show the validated data in the console
  console.log('Validated Data:', validatedData);

  // Create the connection with the database
  database.createDatabaseConnection();

  // Check if the database schema is valid before inserting records
  checkDatabaseSchema((schemaIsValid) => {
    if (schemaIsValid) {
      // Insert valid records in the database
      database.insertValidRecords(validatedData, () => {
        // Close the database connection after the records are inserted
      });
    } else {
      console.error('Error: Database schema is not valid. Cannot insert records.');
      // Close the database connection even if the schema is not valid
      database.closeDatabaseConnection();
    }
  });
} catch (error) {
  console.error('Error:', error.message);
}

// Importing the libraries to be used in the project
// Import the express package framework instantiating it
var express = require('express');
var app = express(); // Call the method using setting to the variable app that has access to all functions and modules of the express framework
var path = require('path');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // App method to encode the URL and only access those which match the requirement

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Search for CSS
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/style.css');
});

// Run a function to submit the information to the database after the information being validated
app.post('/submit', function (req, res) {
  const { first_name, surname, email, phone_number, eircode } = req.body;

  if (!/^[A-Za-z0-9]{1,20}$/.test(first_name)) {
    return res.send('First Name must be alphanumeric, less than 20 characters.');
  }

  if (!/^[A-Za-z0-9]{1,20}$/.test(surname)) {
    return res.send('Surname must be alphanumeric, less than 20 characters.');
  }

  // Create a variable with the regular expressions to require elements from an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Test if the user input and the regex variable are compatible, if not, it returns an error message
    return res.send('Please enter a valid email address!');
  }

  // Using regex to test if the phone is numeric and has 10 digits, if not compatible, send an error message
  if (!/^\d{10}$/.test(phone_number)) {
    return res.send('Phone number must have only numbers up to 10 digits.');
  }

  // Regex to check if the eircode starts with a number and contains only numbers and letters (capital or not), and contains 6 digits
  if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode)) {
    return res.send('Eircode must start with a number and must have up to 6 digits.');
  }

  if (first_name && surname && email && phone_number && eircode) {
    // If every input is valid, run the following code
    // Insert the inputs into the database
    const sql = 'INSERT INTO mysql_table (first_name, surname, email, phone_number, eircode) VALUES(?, ?, ?, ?, ?)';
    connection.query(sql, [first_name, surname, email, phone_number, eircode], function (err, results) {
      // If not able to add to the database, return the error response
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Error: Could not insert data into the database');
      }
      res.send('Form submitted successfully!');
    });
  } else {
    return res.send('Please try again, make sure all required fields are filled in!');
  }
});

app.get('/form', function (req, res) {
  res.sendFile(__dirname + '/form.html');
});

// Set the app to listen to the port 3000 and run a function
app.listen(3000, function () {
  console.log('App Listening on port 3000 ')
  // database.closeDatabaseConnection();
})
