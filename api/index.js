import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import express from "express";
import cors from "cors";

let apolloServer = null;

export default async function handler(req, res) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  if (!apolloServer) {
    const httpServer = http.createServer(app);

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
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/" });
  } else {
    apolloServer.applyMiddleware({ app, path: "/" });
  }

  return new Promise((resolve) => {
    const expressHandler = app._router.handle.bind(app._router);
    expressHandler(req, res, () => {
      resolve();
    });
  });
}
