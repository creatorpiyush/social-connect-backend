const route = require("express").Router();
const bcrypt = require("bcryptjs");

const { Users } = require("../../model");

// * register user route (POST) /api/v1/users/register
route.post("/register", async (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  //   validate user input
  let validateUserInput = (firstName, lastName, username, password, email) => {
    const errors = {};
    if (firstName === "") {
      errors.firstName = "First name must not be empty";
    }
    if (username === "") {
      errors.username = "Username must not be empty";
    }
    if (password === "") {
      errors.password = "Password must not be empty";
    }
    if (email === "") {
      errors.email = "Email must not be empty";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  };

  const { valid, errors } = validateUserInput(
    firstName,
    username,
    password,
    email
  );

  if (!valid) {
    return res.status(400).json(errors);
  }

  //   if user already exists
  const user = await Users.findOne({ username });
  if (user) {
    // console.log(user);
    return res.status(400).json({
      error: "User already exists",
    });
  } else {
    // bcrypt password
    const newPassword = await bcrypt.hash(password, 12);

    const newUser = await new Users({
      firstName,
      lastName,
      username,
      password: newPassword,
      email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await newUser.save(async (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Error saving user in DB",
        });
      }
      res.status(200).json(user);
    });
  }
});

// * login user route (POST) /api/v1/users/login
route.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //   validate user input
  let validateUserInput = (username, password) => {
    const errors = {};
    if (username.trim() === "") {
      errors.username = "Username must not be empty";
    }
    if (password.trim() === "") {
      errors.password = "Password must not be empty";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  };

  const { valid, errors } = validateUserInput(username, password);
  if (!valid) {
    return res.status(400).json(errors);
  }

  //   if user not exists
  const user = await Users.findOne({ username });
  if (!user) {
    return res.status(400).json({
      error: "User not exists",
    });
  } else {
    //   if password is correct
    //  match bcrypt password
    const match = bcrypt.compareSync(password, user.password);

    if (match) {
      return res.json(user);
    } else {
      return res.status(400).json({
        error: "Password is incorrect",
      });
    }
  }
});

// * get all users route (GET) /api/v1/users
route.get("/", async (req, res) => {
  const users = await Users.find();
  return res.status(200).json(users);
});

// * get user by id route (GET) /api/v1/users/:id
route.get("/:id", async (req, res) => {
  const user = await Users.findById(req.params.id).populate("posts");
  return res.status(200).json(user);
});

// * get user by username route (GET) /api/v1/users/username/:username
route.get("/username/:username", async (req, res) => {
  const user = await Users.findOne({ username: req.params.username });
  return res.status(200).json(user);
});

// * update user by id route (PUT) /api/v1/users/update/:id
// route.put("/update/:id", async (req, res) => {
//   const { firstName, lastName, username, password, email } = req.body;
//   const user = await Users.findByIdAndUpdate(req.params.id, {
//     firstName,
//     lastName,
//     username,
//     password,
//     email,
//     updatedAt: Date.now(),
//   });
//   return res.status(200).json(user);
// });

// * delete user by id route (DELETE) /api/v1/users/delete/:id
// route.delete("/delete/:id", async (req, res) => {
//   const user = await Users.findByIdAndDelete(req.params.id);
//   return res.status(200).json(user);
// });

module.exports = route;
