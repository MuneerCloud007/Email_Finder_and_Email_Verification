// Import required modules and controllers
import express from  "express";
const api = express.Router();
import { scrapeController,findEmailVerifierController } from "../controller/emailverfier.controller.js";
import checkAuthorization from "../utils/isAuthorized.js";


// Define your routes
api.post("/post",checkAuthorization, scrapeController); // Assuming you want to define a POST route here
api.post("/getAll",checkAuthorization,findEmailVerifierController);

// Export the router
export default  api;
