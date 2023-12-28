var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    database:"mysql_db",
    user:"root",
    password:"password"

})



// function to create the connection with the data base
function createDatabaseConnection() {
    connection.connect((err) => { //try connection and handle the error, showing a error message 
      if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
      } // if connection is successfull output to the console
      console.log('Connected to MySQL');
    });
  }


  // function to close the data base connection, handle error and output when connection is closed 
function closeDatabaseConnection() {
    connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection:', err.message);
        return;
      }
      console.log('Connection closed');
    });
  }




  // function to check if the records are valid and insert them to the database 
function insertValidRecords(validRecords, callback) {
    // check if the  valid record isn't null
    if (validRecords.length === 0) {
      console.log('No valid records to insert.');
      callback();
      return;
    }
  
    const insertQuery = // instantiate a Sql query to be called 
      'INSERT INTO mysql_table (first_name, surname, email, phone_number, eircode) VALUES ?';
      // creates a map  in the valid records with the persons atributes 
    const values = validRecords.map((record) => [
      record.first_name,
      record.surname,
      record.email,
      record.phone_number,
      record.eircode,
    ]);
     
    // call a connection query  to insert the sql query with the map of  the validRecords
    connection.query(insertQuery, [values], (err, results) => {
      if (err) { // if can't insert show a error message 
        console.error('Error inserting records into MySQL:', err.message);
        callback();
        return;
      } // show how many of the records was able to be inserted into the database 
      console.log(`${results.affectedRows} records inserted into MySQL`);
      callback();
    });
  }

 

  
  // export the modules create when database is called
module.exports = {
    connection,
    createDatabaseConnection,
    closeDatabaseConnection,
    insertValidRecords,
  };

//module.exports = connection1;



