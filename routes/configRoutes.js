const usersR = require("./users");
const toysR = require("./toys");



exports.routeInit = (app) => {
    app.use("/users",usersR);
    app.use("/toys",toysR);
}