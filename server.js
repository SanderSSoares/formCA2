
// importing the libraries to be used in the project 
// import the express package framework instantiating it 
var express = require("express");

var app = express();// call the method  using  setting to the variable app that have access to all functions and modules of the express framework 

var connection = require('./database'); //import mysql connection  and set it to use the attributes  given on data base file 
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

    console.log("App Listening on port 3000")
    connection.connect(function(err){ // try to connect to the database and catch the error if can't connect 

        if(err) throw err;// if erro throw it to the terminal and if connection is successfull output a message 
        console.log('Database connected')
    })
})