const express = require("express");

const app = express();

// * .env config
require("dotenv").config();

require("./model");

// cors
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * Routes
app.use("/api/v1", require("./routes/api"));

// * PORT init
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
