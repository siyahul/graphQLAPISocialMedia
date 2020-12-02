const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.autherization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("invalid or expired token");
      }
    } else {
      throw new AuthenticationError("not authenticated");
    }
  } else {
    throw new AuthenticationError("no autherisation");
  }
};
