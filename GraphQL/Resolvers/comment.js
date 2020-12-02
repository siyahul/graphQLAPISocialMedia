const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../Models/postModel");
const checkAuth = require("../../utils/auth-verify");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Comment must not be empty");
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          createdAt: new Date().toISOString(),
          userName: user.userName,
        });
        return await post.save();
      } else throw new UserInputError("Post not found");
    },
    async deleteComment(_, { postId, commentId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);

      const commentIndex = post.comments.indexOf(
        post.comments.find((comment) => String(comment._id) === commentId)
      );

      if (post.comments[commentIndex].userName === user.userName) {
        post.comments.splice(commentIndex, 1);

        return await post.save();
      } else {
        throw new AuthenticationError("you are not posted this comment");
      }
    },
  },
};
