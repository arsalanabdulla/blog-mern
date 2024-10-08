const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dplzyvxuq",
  api_key: "461458193617547",
  api_secret: "F94fsIhjIR1Jlq6AbsxkFN6WVcs",
});

const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    if (!title || !category || !description || !req.files) {
      return next(
        new HttpError("Fill in all fields and choose thumbnail.", 422)
      );
    }
    const { thumbnail } = req.files;
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail too big. File should be less than 2mb."),
        422
      );
    }
    let fileName = thumbnail.name;
    let splittedFn = fileName.split(".");
    let newFileName = splittedFn[0] + uuid();
    let newFileName1 =
    newFileName+'.'+splittedFn[splittedFn.length - 1];

    const uploadResult = await cloudinary.uploader.upload_stream(   
      {public_id:newFileName} ,
      async (error, result) => {
        if (error) {
          return next(new HttpError(error.message || 'Failed to upload image', 422));
        }
 
        const newPost = await Post.create({
                title,
                category,
                description,
                thumbnail: result.secure_url,
                creator: req.user.id,
              });
              if (!newPost) {
                return next(new HttpError("Post couldn't be created.", 422));
              }
              const cUser = await User.findById(req.user.id);
              const userPostCount = cUser.posts + 1;
              await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
      
              res.status(200).json(newPost);
      }
    );

    // Create a stream to upload the file buffer
    const stream = uploadResult;
    stream.end(thumbnail.data);

    // thumbnail.mv(
    //   path.join(__dirname, "..", "uploads", newFileName1),
    //   async (err) => {
    //     if (err) {
    //       return next(new HttpError(err));
    //     }

    //     const uploadResult = await cloudinary.uploader.upload(
    //       path.join(__dirname, "..", "/uploads", newFileName1),
    //       {
    //         public_id: newFileName,
    //       }
    //     );

    //     if (!uploadResult) {
    //       return next(new HttpError("Failed to upload.", 422));
    //     }
    //     const newPost = await Post.create({
    //       title,
    //       category,
    //       description,
    //       thumbnail: uploadResult.secure_url,
    //       creator: req.user.id,
    //     });
    //     if (!newPost) {
    //       return next(new HttpError("Post couldn't be created.", 422));
    //     }
    //     const cUser = await User.findById(req.user.id);
    //     const userPostCount = cUser.posts + 1;
    //     await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

    //     res.status(200).json(newPost);
    //   }
    // );
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPost = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;
    const postID = req.params.id;
    let { title, category, description } = req.body;
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    const oldPost = await Post.findById(postID);
    if (req.user.id == oldPost.creator) {
      if (!req.files) {
        updatedPost = await Post.findByIdAndUpdate(
          postID,
          {
            title,
            category,
            description,
          },
          { new: true }
        );
      } else {
        const publicId = oldPost.thumbnail.split("/").pop().split(".")[0];
        const result = await cloudinary.uploader.destroy(publicId);
        if (!result) {
          return next(new HttpError("error"));
        }

        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
          return next(
            new HttpError("Thumbnail too big. File should be less than 2mb."),
            422
          );
        }
        fileName = thumbnail.name;
        let splittedFn = fileName.split(".");
        newFileName = splittedFn[0] + uuid();        
        
        const uploadResult = await cloudinary.uploader.upload_stream(   
          {public_id:newFileName} ,
          async (error, result) => {
            if (error) {
              return next(new HttpError(error.message || 'Failed to upload image', 422));
            } 
            
            updatedPost = await Post.findByIdAndUpdate(
              postID,
              {
                title,
                category,
                description,
                thumbnail: result.secure_url,
              },
              { new: true }
            );

            if (!updatedPost) {
              return next(new HttpError("Couldn't update post.",400));
            }
          }
        );
        const stream = uploadResult;
        stream.end(thumbnail.data);
      }
      res.status(200).json(updatedPost);
    }        
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postID = req.params.id;
    if (!postID) {
      return next(new HttpError("Post unavailable.", 400));
    }
    const post = await Post.findById(postID);
    const fileName = post.thumbnail;
    if (req.user.id == post.creator) {
      const publicId = fileName.split("/").pop().split(".")[0];
      const result = await cloudinary.uploader.destroy(publicId);
      if (!result) {
        return next(new HttpError("error"));
      }

      await Post.findByIdAndDelete(postID);
      const cUser = await User.findById(req.user.id);
      const userPostCount = cUser.posts - 1;
      await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
      res.status(200).json("Post deleted successfully.");

      // fs.unlink(
      //   path.join(__dirname, "..", "uploads", publicId+'.'+publicId1),
      //   async (err) => {
      //     if (err) {
      //       return next(new HttpError(error));
      //     } else {
      //       await Post.findByIdAndDelete(postID);
      //       const cUser = await User.findById(req.user.id);
      //       const userPostCount = cUser.posts - 1;
      //       await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
      //       res.status(200).json("Post deleted successfully.");
      //     }
      //   }
      // );
    } else {
      return next(new HttpError("Post couldn't be deleted", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
