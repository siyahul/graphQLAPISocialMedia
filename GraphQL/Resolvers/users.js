const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Models/userModel");
const checkAuth = require("../../utils/auth-verify");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { SECRET_KEY } = require("../../config");

const genarateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userName: user.userName,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async followUser(_, { userId }, context) {
      const { id } = checkAuth(context);
      const user = await User.findById(id);
      const followUser = await User.findById(userId);
      if (user && followUser) {
        const isFollowing =
          user.followings.find(
            (following) => String(following) === String(userId)
          ) &&
          followUser.followers.find(
            (follower) => String(follower) === String(user._id)
          );
        if (!isFollowing) {
          user.followings.unshift(followUser._id);
          followUser.followers.unshift(user._id);
          await followUser.save();
          await user.save();
          return "followed user successfully";
        } else {
          throw new Error("You are already following");
        }
      } else {
        throw new Error("User not found");
      }
    },
    async unFollowUser(_, { userId }, context) {
      const { id } = checkAuth(context);
      const user = await User.findById(id);
      const followUser = await User.findById(userId);
      if (user && followUser) {
        const isFollowing =
          user.followings.find(
            (following) => String(following) === String(userId)
          ) &&
          followUser.followers.find(
            (follower) => String(follower) === String(user._id)
          );
        if (isFollowing) {
          const index = user.followings.indexOf(userId);
          user.followings.splice(index, 1);

          const index2 = followUser.followers.indexOf(user._id);
          followUser.followers.splice(index2, 1);

          await user.save();
          await followUser.save();

          return "unFollowed user successfully";
        }
        else{
          throw new Error('You are not following');
        }
      } else {
        throw new Error("User not found");
      }
    },
    async login(_, { userName, password }) {
      const { errors, valid } = validateLoginInput(userName, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ userName });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const matchPassword = await bcrypt.compareSync(password, user.password);
      if (!matchPassword) {
        errors.general = "Password incorrect";
        throw new UserInputError("Wrong Credentials", { errors });
      }
      const token = genarateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { userName, email, password, confirmPassword } },
      context,
      info
    ) {
      const { valid, errors } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );
      const user = await User.findOne({ userName });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      if (user) {
        throw new UserInputError("userName is Taken", {
          error: {
            userName: "user name is taken",
          },
        });
      }

      password = await bcrypt.hashSync(password, 12);

      const newUser = new User({
        email,
        userName,
        password,
        createdAt: new Date().toISOString(),
        followers: [],
        followings: [],
      });
      try {
        var res = await newUser.save();
      } catch (err) {
        throw new Error(err);
      }
      const token = genarateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
