const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  postText: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  unlike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      commentText: {
        type: String,
        required: true,
      },
      commentDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  postDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("posts", schema);
