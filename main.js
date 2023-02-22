const express = require('express');
const mysql = require('mysql');
const body_parser = require('body-parser');
const mysql_config = require('./app/config/mysql_db_config');

var mysql_connect = mysql.createConnection(mysql_config);

mysql_connect.connect((err)=>{
    if (err) throw err;
    console.log('Database connected');
})

