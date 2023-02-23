/*
Importing modules - 
express - to create a web APIs, 
bodyparser - act as a middleware for request and response
dotenv - to import environment variables
*/
const express = require('express');
const body_parser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(body_parser.json());

app.use(body_parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "This is a user login application"
    })
});

/*
Importing local module that assigns routes to the app
*/
require("./app/routes/routes")(app);


/*
Starts server at port 3000
*/
app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});