const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Models/userModel");
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