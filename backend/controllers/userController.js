const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/errorModel");
const User = require("../models/userModel");

const register = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    const emailExist = await User.findOne({ email: newEmail });
    if (emailExist) {
      return next(new HttpError("Email already exist.", 422));
    }
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Password do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`New user ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid credentials.", 422));
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid credentials.", 422));
    }
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed.Please check your credentials.", 422)
    );
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found.", 422));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image.", 422));
    }
    const user = await User.findById(req.user.id);

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture too big. Should be less than 500kb"),
        422
      );
    }

    let fileName = avatar.name;
    let splittedFn = fileName.split(".");
    let newFileName =
      splittedFn[0] + uuidv4() + "." + splittedFn[splittedFn.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "/uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );

        if (!updatedAvatar) {
          return next(new HttpError("Avatar couldn't be changed.", 422));
        }
        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!name || !email || !currentPassword) {
      return next(new HttpError("Name, email, and current password are required.", 422));
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found.", 403));
    }

    // Check if the email is already in use by another user
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id.toString() !== req.user.id) {
      return next(new HttpError("Email already exists.", 422));
    }

    // Validate the current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return next(new HttpError("Invalid current password.", 422));
    }

    const updateData = { name, email }; // Update name and email by default

    // Check if new password fields are provided
    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return next(new HttpError("New passwords do not match.", 422));
      }

      if (newPassword.trim().length < 6) {
        return next(new HttpError("New password should be at least 6 characters.", 422));
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPass; // Add hashed password to the update data
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};


const getAuthors = async (req, res, next) => {
  try {
    const author = await User.find().select("-password");
    if (!author) {
      return next(new HttpError("Author not found.", 422));
    }
    res.status(200).json(author);
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

module.exports = {
  register,
  login,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
