module.exports = app => {
    const users = require("../controllers/controller");

    app.post("/signup", users.create);

    app.post("/login", users.login);

    app.get("/users", users.get_users);

    app.put("/:id/user", users.update_user);
}