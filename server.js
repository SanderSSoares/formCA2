var express = require("express");
var app = express();
var connection = require('./database');
var path = require('path');

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));

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
          // using regex test if the phone is numeric and has 10 digits 
      if (!/^\d{10}$/.test(phone_number)) {
        return res.send("Phone number must have only numbers up to 10 digits.");
      }
      if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode)) {
        return res.send("Eircode must start with a number,and must has up to 6 digits.");
      }
    if(first_name && surname && email && phone_number && eircode){

        const sql = "INSERT INTO mysql_table (first_name, surname, email, phone_number, eircode) VALUES(?, ?, ?, ?, ?)";
        connection.query(sql, [first_name, surname, email, phone_number, eircode], function(err, results){

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

app.listen(3000, function(){

    console.log("App Listening on port 3000")
    connection.connect(function(err){

        if(err) throw err;
        console.log('Database connected')
    })
})