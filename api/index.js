import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { gql } from "apollo-server-express";

// Define schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    hello: () => "world",
  },
};

// Server instance - will be reused between requests
let apolloServer = null;

// Initialize Apollo Server
async function initializeApollo() {
  if (!apolloServer) {
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      // Crucial for serverless:
      introspection: true,
    });
    await apolloServer.start();
  }
  return apolloServer;
}

// Vercel serverless handler
export default async function handler(req, res) {
  // Setup express
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize Apollo
  const server = await initializeApollo();

  // Apply middleware to express
  server.applyMiddleware({ app });

  // Handle the request with express
  return new Promise((resolve, reject) => {
    const expressHandler = app._router.handle.bind(app._router);
    expressHandler(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
