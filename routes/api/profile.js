const route = require("express").Router();

const { Users, Posts } = require("../../model");

// * get user profile route (GET) /api/v1/profile/:username
route.get("/:username", async (req, res) => {
  const user = await Users.findOne({ username: req.params.username }).populate(
    "posts likedPosts followers following"
    // todo:  add messages and notifications
  );
  return res.status(200).json(user);
});

// * update user profile route (PUT) /api/v1/profile/update/:username
// route.put("/update/:username", async (req, res) => {
//   const { firstName, lastName, username, password, email } = req.body;
//   const user = await Users.findOneAndUpdate(
//     { username: req.params.username },
//     {
//       firstName,
//       lastName,
//       username,
//       password,
//       email,
//       updatedAt: Date.now(),
//     }
//   );
//   return res.status(200).json(user);
// });

// * delete user profile route (DELETE) /api/v1/profile/delete/:username
// route.delete("/delete/:username", async (req, res) => {
//   const user = await Users.findOneAndDelete({ username: req.params.username });
//   return res.status(200).json(user);
// });

// * update user avatar route (PUT) /api/v1/profile/avatar/:username
// route.put("/avatar/:username", async (req, res) => {
//   const { avatar } = req.body;
//   const user = await Users.findOneAndUpdate(
//     { username: req.params.username },
//     {
//       avatar,
//       updatedAt: Date.now(),
//     }
//   );
//   return res.status(200).json(user);
// });

// follow user route (PUT) /api/v1/profile/follow/:username/:followedUser
route.put("/follow/:username/:followedUser", async (req, res) => {
  await Users.findOne({ username: req.params.username })
    .then(async (user) => {
      const user2 = await Users.findOneAndUpdate(
        { username: req.params.followedUser },
        {
          $push: { followers: user._id },
        }
      );
      return user2;
    })
    .then(async (user2) => {
      const user = await Users.findOneAndUpdate(
        { username: req.params.username },
        {
          $push: { following: user2._id },
        }
      );
      return res.status(200).json(user);
    });
});

// unfollow user route (PUT) /api/v1/profile/unfollow/:username/:followedUser
route.put("/unfollow/:username/:followedUser", async (req, res) => {
  await Users.findOne({ username: req.params.username })

    .then(async (user) => {
      const user2 = await Users.findOneAndUpdate(
        { username: req.params.followedUser },
        {
          $pull: { followers: user._id },
        }
      );
      return user2;
    })
    .then(async (user2) => {
      const user = await Users.findOneAndUpdate(
        { username: req.params.username },
        {
          $pull: { following: user2._id },
        }
      );
      return res.status(200).json(user);
    });
});

module.exports = route;
