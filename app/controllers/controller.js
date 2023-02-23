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
            res.status(500).send({
                success: false,
                message: err.message || "error"
            })
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
            } else {
                res.status(500).send({
                    success: false,
                    message: "Error retrieving user with email " + email_id
                });
            }
        } else {
            const comparison = await bcrypt.compare(password, data.Password);
            if (comparison) {
                let token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: email_id,
                }, 'secret');

                res.send({
                    success: true,
                    Token: token
                });
            }
            else {
                res.status(500).send({
                    success: false,
                    message: "Incorrect email id or password"
                });
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
    }

    var name = req.query.name;

    User.get_users(name, (err, data) => {
        if (err) {
            if (err.message === "not_found") {
                res.status(404).send({
                    success: false,
                    message: `No users found with name ${name}.`
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: "Error retrieving users with name: " + name
                });
            }
        } else {
            res.send({
                success: true,
                users: data
            });
        }
    });
}

exports.update_user = (req, res) => {

    if (!req.body || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('Phone_number')) {
        res.status(400).send({
            success: false,
            message: "Missing required fields"
        });
    }

    if (!req.params || !req.params.hasOwnProperty('id')) {
        res.status(400).send({
            success: false,
            message: "Missing user id path parameter"
        });
    }

    var payload = {
        userdata: {
            email: req.body.email,
            name: req.body.name,
            Phone_number: req.body.Phone_number,
            USER_UPDATED_DATE: new Date()
        },
        user_id: req.params.id
    };

    User.update_user(payload, (err, data) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: "User update failed"
            });
        } else {
            res.send({
                success: true,
                user: payload.userdata
            });
        }
    });
}   