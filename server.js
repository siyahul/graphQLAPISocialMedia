const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./GraphQL/typedefs");
const resolvers = require("./GraphQL/resolvers");
const { MONGODB } = require("./config");

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({req})
});

server
  .listen({ port: 5000 })
  .then((res) => console.log(`server started ${res.url}`));