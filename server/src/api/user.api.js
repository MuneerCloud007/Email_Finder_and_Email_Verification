import express from "express";
import { register, refresh,login,logout} from "../controller/user.controller.js";

const api = express.Router();

// Register route
api.post('/register', register);

// Login route
 api.post('/login', login);

// Refresh token route
api.post('/refresh', refresh);

// Logout route
 api.post('/logout', logout);

export default api;


