const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Programming",
        "Web Development",
        "Personal Development",
        "Business",
        "Lifestyle",
        "Education",
        "Finance",
        "Entertainment",
        "Science",
        "Gaming",
        "Fashion",
        "Sport",
        "History",
        "Uncategorized"
      ],
      message: "{Value is not supported}",
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
