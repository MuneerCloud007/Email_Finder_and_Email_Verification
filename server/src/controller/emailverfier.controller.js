// src/controllers/webscrapeController.js
import  WebscrapingData  from '../webscraping/webscrap.js';
import ApiError from '../utils/ApiError.js';
import {URL} from 'url';
import wrapperFunEmailVerfier from "../email_verfication/emailVerfier.algo.js";
import axios from "axios"

const scrapeController = async (req, res, next) => {
    const { url,firstName,lastName } = req.body;

    if (!url) {
        return next(ApiError.badRequest('URL is required'));
    }

    try {
        console.log(url);

        const urlString =await axios.post("https://puputeer-render.onrender.com/scrape",{
            "url":url
          
        });
        console.log(urlString.data.Link);
        const parsedUrl = new URL(urlString.data.Link);

        // Extract domain
        const domain = parsedUrl.hostname.replace(/^www\./, ''); // Remove 'www.' if present
        console.log(domain)

        //Webscraping is completed
        const arr=await wrapperFunEmailVerfier(firstName,lastName,domain);
        console.log(arr);

        //Now email Verification process has to be started....
        res.status(200).json({
            sucess: true,
            data: arr,

        });
    } catch (error) {
        console.log(error)
        next(ApiError.internal('Failed to scrape the website'));
    }
};

export  {
    scrapeController,
}
