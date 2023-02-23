/*
Controller module for the application
Imported modules
bcrypt - used here to encrypt the password
jsonwebtoken - to generate bearer token
*/


const User = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
    if (!req.body || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('Password')) {
        res.status(400).send({
            success: false,
            message: "Missing required fields"
        });
        return;
    }

    const password = req.body.Password;
    const encryptedPassword = await bcrypt.hash(password, 10)

    var user_data = {
        email: req.body.email,
        name: req.body.name,
        password: encryptedPassword,
        USER_CREATED_DATE: new Date(),
        USER_UPDATED_DATE: new Date(),
        ID: Date.now().toString(36)
    }

    User.create(user_data, (err, data) => {
        if (err) {
            if (err.message.includes('Duplicate')) {
                res.status(400).send({
                    success: false,
                    message: "User with email id " + user_data.email + " already exists."
                })
                return;
            }
            else {
                res.status(500).send({
                    success: false,
                    message: err.message || "error"
                })
                return;
            }
        }
        else res.send(data);
    });
};

exports.login = async (req, res) => {
    if (!req.body || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('Password')) {
        res.status(400).send({
            success: false,
            message: "Missing required fields"
        });
        return;
    }

    var email_id = req.body.email;
    var password = req.body.Password;

    User.login(email_id, async (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    success: false,
                    message: `User not found with email ${email_id}.`
                });
                return;
            } else {
                res.status(500).send({
                    success: false,
                    message: "Error retrieving user with email " + email_id
                });
                return;
            }
        } else {
            const comparison = await bcrypt.compare(password, data.Password);
            if (comparison) {
                let token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), //token with 1 hour expiry
                    data: email_id,
                }, 'secret');

                res.send({
                    success: true,
                    Token: token
                });
                return;
            }
            else {
                res.status(500).send({
                    success: false,
                    message: "Incorrect email id or password"
                });
                return;
            }
        }
    })
};

exports.get_users = (req, res) => {

    if (!req.query || !req.query.hasOwnProperty('name')) {
        res.status(400).send({
            success: false,
            message: "Missing the required query parameter: name"
        });
        return;
    }

    var name = req.query.name;

    User.get_users(name, (err, data) => {
        if (err) {
            if (err.message === "not_found") {
                res.status(404).send({
                    success: false,
                    message: `No users found with name ${name}.`
                });
                return;
            } else {
                res.status(500).send({
                    success: false,
                    message: "Error retrieving users with name: " + name
                });
                return;
            }
        } else {
            res.send({
                success: true,
                users: data
            });
            return;
        }
    });
}

exports.update_user = (req, res) => {

    if (!req.body || (!req.body.hasOwnProperty('email') && !req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('Phone_number'))) {
        res.status(400).send({
            success: false,
            message: "Missing required fields"
        });
        return;
    }

    if (!req.params || !req.params.hasOwnProperty('id')) {
        res.status(400).send({
            success: false,
            message: "Missing user id path parameter"
        });
        return;
    }

    var user_data = req.body;
    user_data.USER_UPDATED_DATE = new Date();

    var payload = {
        userdata: user_data,
        user_id: req.params.id
    };

    User.update_user(payload, (err, data) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: "User update failed"
            });
            return;
        } else {
            res.send({
                success: true,
                user: payload.userdata
            });
            return;
        }
    });
}   