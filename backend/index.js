import express from "express";
import http from "http";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from "graphql-passport";

import mergeResolvers from "./resolvers/index.js";
import mergeTypeDefs from "./typeDefs/index.js";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();
const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => console.log(error));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergeTypeDefs,
  resolvers: mergeResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  cors({
    origin: "https://localhost:3000",
    credentials: true, // Correct case
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

await connectDB();
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at express http://localhost:4000/`);
