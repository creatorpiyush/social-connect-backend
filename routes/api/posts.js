const route = require("express").Router();

const { Users, Posts } = require("../../model");

// * get post route (GET) /api/v1/posts
route.get("/", async (req, res) => {
  const posts = await Posts.find();
  return res.status(200).json(posts);
});

// * get posts for home page route (GET) /api/v1/posts/home
route.get("/home/:username", async (req, res) => {
  let allPosts = [];

  // show posts from followed users
  await Users.findOne({ username: req.params.username }).then((user) => {
    return Users.find({ _id: { $in: user?.following } }).then((users) => {
      // find posts from followed users
      for (const user of users) {
        return Posts.find({ _id: { $in: user?.posts } }).then((posts) => {
          allPosts = [...allPosts, ...posts];
        });
      }
    });
  });

  // show posts from self
  await Users.findOne({ username: req.params.username }).then((user) => {
    return Posts.find({ _id: { $in: user?.posts } }).then((posts) => {
      allPosts = [...allPosts, ...posts];
    });
  });

  // sort by postDate
  allPosts.sort((a, b) => {
    return b.postDate - a.postDate;
  });

  return res.status(200).json(allPosts);
});

// * get post by id route (GET) /api/v1/posts/:id
route.get("/:id", async (req, res) => {
  const post = await Users.findOne({ _id: req.params.id });
  return res.status(200).json(post);
});

// * get post by username route (GET) /api/v1/posts/username/:username
route.get("/username/:username", async (req, res) => {
  const post = await Users.findOne({ username: req.params.username }).then(
    (user) => {
      return Posts.find({ _id: { $in: user.posts } }).then((posts) => {
        // console.log(posts);
        return posts;
      });
    }
  );
});

// * create post route (POST) /api/v1/posts/create
route.post("/create", async (req, res) => {
  const { postedBy, postText } = req.body;
  // validate postText
  // console.log(postedBy);
  if (postText === undefined || postText === null) {
    return res.status(400).json("Post text is required");
  }

  const post = await Posts.create({
    postText,
    postDate: Date.now(),
    postedBy,
  }).then((post) => {
    return Users.findOneAndUpdate(
      { username: postedBy },
      { $push: { posts: post._id } }
    );
  });
  return res.status(200).json(post);
});

// * like post route (PUT) /api/v1/posts/like/:id
route.put("/like/:id", async (req, res) => {
  const { username } = req.body;
  await Users.findOne({ username })
    .then(async (user) => {
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: user.id },
        }
      );
      return post;
    })
    .then(async (post) => {
      await Users.findOneAndUpdate(
        { username: username },
        {
          $push: { likedPosts: post._id },
        }
      );
      return res.status(200).json(post);
    });
});

// * unlike post route (PUT) /api/v1/posts/unlike/:id
route.put("/unlike/:id", async (req, res) => {
  const { username } = req.body;
  await Users.findOne({ username }).then(async (user) => {
    // console.log(user.id);
    const post = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { unlike: user.id },
      }
    );
    // console.log(post);
    return post;
  });
});

// * comment post route (PUT) /api/v1/posts/comment/:id
route.put("/comment/:id", async (req, res) => {
  const { username, commentText } = req.body;
  const post = await Users.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: { comments: { username, commentText, commentDate: Date.now() } },
    }
  );
  return res.status(200).json(post);
});

// * delete comment route (PUT) /api/v1/posts/delete-comment/:id
route.put("/delete-comment/:id", async (req, res) => {
  const { username, commentText } = req.body;
  const post = await Users.findOneAndUpdate(
    { _id: req.params.id },
    {
      $pull: { comments: { username, commentText } },
    }
  );
  return res.status(200).json(post);
});

// * delete post route (DELETE) /api/v1/posts/delete/:id
route.delete("/delete/:id", async (req, res) => {
  const post = await Users.findOneAndDelete({ _id: req.params.id });
  return res.status(200).json(post);
});

// * get all liked posts route (GET) /api/v1/posts/liked/:username
route.get("/liked/:username", async (req, res) => {
  const user = await Users.findOne({
    username: req.params.username,
  });
  const posts = await Posts.find({ _id: { $in: user.likedPosts } }).then(
    (posts) => {
      return posts;
    }
  );
  return res.status(200).json(posts);
});

module.exports = route;
