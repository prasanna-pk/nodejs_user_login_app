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

require("./app/routes/routes")(app);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});