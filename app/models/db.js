/*
mysql module used to access the mysql database 
 */
const mysql = require('mysql');
const mysql_config = require('../config/mysql_db_config');

var mysql_connect = mysql.createConnection(mysql_config);

mysql_connect.connect((err)=>{
    if (err) throw err;
    console.log('Database connected');
})

module.exports = mysql_connect;
