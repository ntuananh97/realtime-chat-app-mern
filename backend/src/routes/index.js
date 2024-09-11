const UserRoutes = require("./user.routes");
const AuthRoutes = require("./auth.routes");
const MessageRoutes = require("./message.routes");

const routes = (app) => {
    app.use("/api/auth", AuthRoutes);
    app.use("/api/user", UserRoutes);
    app.use("/api/message", MessageRoutes);
};
  
module.exports = routes;
  