// src/controllers/webscrapeController.js
import WebscrapingData from '../webscraping/webscrap.js';
import ApiError from '../utils/ApiError.js';
import { URL } from 'url';
import wrapperFunEmailVerfier from "../email_verfication/emailVerfier.algo.js";
import axios from "axios"
import emailVerificationModel from '../model/emailverfier.model.js';
import mongoose from 'mongoose';

const scrapeController = async (req, res, next) => {
    const { url, firstName, lastName, company, position, user, user_position } = req.body;

    if (!url) {
        return next(ApiError.badRequest('URL is required'));
    }

    try {
        console.log(url);

        // const urlString =await axios.post("https://puputeer-render.onrender.com/scrape",{
        //     "url":url

        // });
        // console.log(urlString.data.Link);
        // const parsedUrl = new URL(urlString.data.Link);

        // // Extract domain
        // const domain = parsedUrl.hostname.replace(/^www\./, ''); // Remove 'www.' if present
        // console.log(domain)

        // //Webscraping is completed
        // const arr=await wrapperFunEmailVerfier(firstName,lastName,domain);
        // console.log(arr);
        const createEmailverifier = emailVerificationModel({
            url,
            firstName,
            lastName,
            company,
            position,
            user,
            user_position

        })
        const data = await createEmailverifier.save();




        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        //Now email Verification process has to be started....
        res.status(200).json({
            sucess: true,
            data: data,

        });
    } catch (error) {
        console.log(error)
        next(ApiError.internal('Failed to scrape the website'));
    }
};

const findEmailVerifierController = async (req, res, next) => {
    const { user } = req.body;
    try {
        if (!user) {
            next(ApiError.notFound("THere is not user"));

        }

        const arr = await emailVerificationModel.find({ user: user });


        const groupedData = {};

        arr.forEach(obj => {
            if (!groupedData[obj.url]) {
                groupedData[obj.url] = [];
            }
            groupedData[obj.url].push(obj);
        });

        res.status(200).json({
            success: true,
            data: groupedData
        })



    }
    catch (err) {
        next(ApiError.internal(err.message || "Internal Errror"));

    }
}

const findEmailVerifierById = async (req, res, next) => {
    const objectId = req.params.id;
    if (!objectId) {
        next(ApiError.badRequest("Please provide a objectId"))
    }
    try {
        const data = await emailVerificationModel.findById(objectId);
        if (!data) {
            throw new Error(ApiError.badRequest("Please provide a correct objectId"))

        }
        console.log(data);
        const groupedData = {};
        
        groupedData[data.url]=data;




        res.header("Content-Type", "application/json");
        res.status(200).json({
            sucess: "true",
            data: groupedData
        })



    }
    catch (err) {
        next(err);
    }





}
export {
    scrapeController,
    findEmailVerifierController,
    findEmailVerifierById
}
