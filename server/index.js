import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './src/utils/errorHandler.js';
import emailVerifier from './src/api/emailVerfier.api.js';
import DbConnection from './src/utils/dbconnection.js';
import userApi from './src/api/user.api.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the .env file
dotenv.config({ path: path.join(__dirname, '.env') });

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

// Connect to the database
DbConnection().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error("There is an issue with the MongoDB connection: ", err);
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
