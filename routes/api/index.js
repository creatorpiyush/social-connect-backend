const route = require("express").Router();

route.get("/", (req, res) => {
  res.send("Hello World");
});

route.use("/users", require("./users"));

route.use("/posts", require("./posts"));

route.use("/profile", require("./profile"));

module.exports = route;
