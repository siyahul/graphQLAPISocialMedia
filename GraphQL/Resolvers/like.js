const Post = require("../../Models/postModel");
const checkAuth = require("../../utils/auth-verify");

module.exports = {
  Mutation: {
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);

      if (post) {
        const alreadyLiked = post.likes.find(
          (like) => like.userId === user.id
        );
        if (!alreadyLiked) {
          post.likes.unshift({
            userId: user.id,
            userName: user.userName,
            createdAt: new Date().toISOString(),
          });
          return await post.save();
        } else {
          throw new Error("you are already liked");
        }
      } else {
        throw new Error("Post not found");
      }
    },
    async unLikePost(_, { postId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const likeIndex = post.likes.indexOf(
          post.likes.find((like) => like.userId === user.id)
        );
        if (likeIndex >= 0) {
          post.likes.splice(likeIndex, 1);
          return await post.save();
        } else {
          throw new Error("you are not liked this post");
        }
      } else {
        throw new Error("Post not found");
      }
    },
  },
};
