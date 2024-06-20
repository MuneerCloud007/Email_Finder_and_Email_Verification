// Import required modules and controllers
import express from  "express";
const api = express.Router();
import { scrapeController,findEmailVerifierController,findEmailVerifierById } from "../controller/emailverfier.controller.js";
import checkAuthorization from "../utils/isAuthorized.js";


// Define your routes
api.post("/post",checkAuthorization, scrapeController); // Assuming you want to define a POST route here
api.post("/getAll",checkAuthorization,findEmailVerifierController);
api.route("/getById/:id").post(findEmailVerifierById);

// Export the router
export default  api;
