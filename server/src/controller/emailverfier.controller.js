// src/controllers/webscrapeController.js
import  WebscrapingData  from '../webscraping/webscrap.mjs';
import ApiError from '../utils/ApiError.js';
import {URL} from 'url';
import wrapperFunEmailVerfier from "../email_verfication/emailVerfier.algo.js";

const scrapeController = async (req, res, next) => {
    const { url,firstName,lastName } = req.body;
    console.log("I am here =" + url);

    if (!url) {
        return next(ApiError.badRequest('URL is required'));
    }

    try {
        console.log(url);
        const companyLink = await WebscrapingData(url);

        const urlString = companyLink;
        const parsedUrl = new URL(urlString.Link);

        // Extract domain
        const domain = parsedUrl.hostname.replace(/^www\./, ''); // Remove 'www.' if present
        console.log(domain)

        //Webscraping is completed
        const arr=await wrapperFunEmailVerfier(firstName,lastName,domain);

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
