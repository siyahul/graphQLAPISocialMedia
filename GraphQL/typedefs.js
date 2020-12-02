const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    _id: ID!
    caption: String!
    createdAt: String!
    userName: String!
    comments:[Comment]
    likes:[Like]
  }
  type Comment {
    _id: ID!
    createdAt: String!
    userName: String!
    body: String!
  }
  type Like{
    _id:ID!
    userName: String!
    userId:ID!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    userName: String!
    createdAt: String!
  }
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(userName: String!, password: String!): User!
    createPost(caption: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!,body: String!): Post!
    deleteComment(postId: ID!,commentId: ID!): Post!
    likePost(postId: ID!): Post!
    unLikePost(postId: ID!): Post!
  }
`;
