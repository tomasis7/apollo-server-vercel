import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import cors from "cors";

// Keep Apollo Server instance
let apolloServer = null;

export default async function handler(req, res) {
  // Setup Express
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize Apollo Server if needed
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

    // Create server with simplified config
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true, // Enable introspection for tools like Postman
    });

    await apolloServer.start();
  }

  // Apply middleware every time
  apolloServer.applyMiddleware({ app, path: "/", cors: false });

  // Pass the request to Express
  return app(req, res);
}
