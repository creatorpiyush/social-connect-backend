const mongoose = require("mongoose");

require("dotenv").config();

mongoose.set("strictQuery", true);

mongoose.connect(
  process.env.db_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, info) => {
    if (err) console.log(err);
    else console.log(`DB connected... `);
  }
);

module.exports = {
  Users: require("./users"),
  Posts: require("./posts"),
};
