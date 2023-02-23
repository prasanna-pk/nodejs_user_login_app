/*
Models module for the application - to access the database and perform read/write operations.
*/

const db = require('./db');

// constructor
const User = function (user) {
  this.email = user.email;
  this.name = user.name;
};


User.create = (userdata, result) => {
  db.query("INSERT INTO Test_DB.UserTable set ?", userdata, (err, res) => {
    delete userdata.password;
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    };
    result(null, { ...userdata });
  });
};

User.login = (user_id, result) => {
  db.query(`SELECT * FROM Test_DB.UserTable where Email = "${user_id}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  })
}

User.get_users = (search_name, result) => {
  db.query(`SELECT ID,Name,Email,Phone_number,USER_CREATED_DATE,USER_UPDATED_DATE FROM Test_DB.UserTable where Name REGEXP "${search_name}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found user with the id
    result({ message: "not_found" }, null);
  })
}


User.update_user = (payload, result) => {
  db.query(`UPDATE Test_DB.UserTable SET ? WHERE ID = ?`, [payload.userdata, payload.user_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  })
}

module.exports = User;