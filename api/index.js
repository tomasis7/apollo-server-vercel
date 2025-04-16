import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();
app.use(cors()), express.json();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = { Query: { hello: () => "world" } };

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
const serverStartup = server.start().then(() => {
  server.applyMiddleware({ app, path: "/", cors: false });
});

export default async function handler(req, res) {
  await serverStartup;
  return app(req, res);
}
