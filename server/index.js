import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './src/utils/errorHandler.js';
import emailVerifier from './src/api/emailVerfier.api.js';
import DbConnection from './src/utils/dbconnection.js';
import userApi from './src/api/user.api.js';

// Load environment variables from the .env file
dotenv.config({ path: './.env' });

const app = express();

// CORS options
const corsOptions = {
  origin: "*", // Allow requests from any origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Specify other allowed headers as needed
  exposedHeaders: 'Access-Control-Allow-Origin'
};

// Enable CORS with specified options
app.use(cors(corsOptions));

// Middleware for parsing JSON and urlencoded data and cookie handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic test route
app.get('/test', (req, res) => {
  res.send('Server is running!');
});

// Connect to the database
DbConnection().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error("There is an issue with the MongoDB connection: ", err);
  process.exit(1); // Exit the process with failure
});

// Routes
app.use("/api/v1/user", userApi);
app.use("/api/v1/emailVerifier", emailVerifier);

// Wildcard route for undefined routes
app.all('*', (req, res, next) => {
  next(ApiError.notFound('Route not found'));
});

// Error handling middleware
app.use(errorHandler);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  console.log("Production mode enabled");
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"))
  );
}

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
