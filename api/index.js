import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import cors from "cors";

let apolloServer = null;

export default async function handler(req, res) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  if (!apolloServer) {
    const typeDefs = gql`
      type Query {
        hello: String
      }
    `;

    const resolvers = {
      Query: {
        hello: () => "world",
      },
    };

    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
    });

    await apolloServer.start();
  }

  apolloServer.applyMiddleware({ app, path: "/", cors: false });

  return app(req, res);
}
