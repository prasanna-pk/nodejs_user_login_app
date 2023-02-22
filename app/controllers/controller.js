const User = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Empty body"
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
                message: err.message || "error"
            })
        }
        else res.send(data);
    });
};

exports.login = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Empty body"
        });
    }

    var email_id = req.body.email;
    var password = req.body.Password;

    User.login(email_id, async (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Customer with email ${email_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Customer with email " + email_id
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
                    success: false
                });
            }
        }
    })
};

exports.get_users = (req, res) => {
    var name = req.query.name;

    User.get_users(name, (err, data) => {
        if (err) {
            if (err.message === "not_found") {
                res.status(404).send({
                    message: `No users found with name ${name}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving users with name " + name
                });
            }
        } else {
            res.send(data);
        }
    });
}

exports.update_user = (req, res) => {
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
                    success: false
                });
        } else {
            res.send({
                success: true
            });
        }
    });
}   