
import { promises as fs } from 'fs';
import { promisify } from 'util';
import rimrafModule from 'rimraf';
 import chromium from "@sparticuz/chromium";
import puppeteer from 'puppeteer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import Chromium from 'chrome-aws-lambda';

const rimraf = promisify(rimrafModule);
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

async function clearCache() {
    await rimraf('./.cache/puppeteer');
}
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
const userAgentStrings = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
];

// Utility to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getRandomUserAgent = () => {
    const randomIndex = Math.floor(Math.random() * userAgentStrings.length);
    return userAgentStrings[randomIndex];
};
let maxRetries=4;

async function safeGoto(page, url, options, retries = 0) {
    try {
        await page.goto(url, options);
    } catch (error) {
        if (retries < maxRetries) {
            console.log(`Retrying navigation to ${url} (${retries + 1}/${maxRetries})...`);
            await safeGoto(page, url, options, retries + 1);
        } else {
            throw error;
        }
    }
}

const pageDelays = Array.from({ length: 30 }, (_, i) => 1000 + i * 100);
const scrollTimes = Array.from({ length: 40 }, (_, i) => 100 * i);

const navigate_urls = [
    "https://www.geeksforgeeks.org/array-data-structure/",
    "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript",
    "https://www.codewars.com/collections/basic-js",
    "https://www.w3schools.com/jsref/jsref_obj_array.asp",
];


const WebscrapingData = (url1) => {
    return new Promise(async (resolve, reject) => {
        await clearCache();
        console.log("I am inside Puppeteer");
        let options = {};
        console.log(process.env.NODE_ENV)





        options = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--no-zygote',
                '--disable-software-rasterizer',
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-client-side-phishing-detection',
                '--disable-default-apps',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-sync',
                '--disable-translate',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run',
                '--safebrowsing-disable-auto-update',
                '--enable-automation',
                '--password-store=basic',
                '--use-mock-keychain',
                "--hide-scrollbars",
                "--disable-web-security",
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH:
                await chromium.executablePath,
           

            headless: true,
            dumpio: true,

            ignoreHTTPSErrors: true,
        };
      

        console.log(await chromium.executablePath);

        console.log(options)

        puppeteer.launch(options).then(async browser => {
            console.log("Puputeer is launched")
            const page = await browser.newPage();
            await page.setViewport({ width: 800, height: 600 });


            const cookie = {
                name: 'li_at',
                value: 'AQEFAQ8BAAAAAA_9W-EAAAGP8vkCmgAAAZAXBY8XVgAAsnVybjpsaTplbnRlcnByaXNlQXV0aFRva2VuOmVKeGpaQUFDbHFhTU15Q2EzWUJ0R29nV1ZQK3hrUkhFU09WY1hnaG1SSzV3ZFdGZ0JBQ2VrZ2VEXnVybjpsaTplbnRlcnByaXNlUHJvZmlsZToodXJuOmxpOmVudGVycHJpc2VBY2NvdW50Ojc1NjU1MzcyLDEyMDU4NzkyNiledXJuOmxpOm1lbWJlcjo4ODUyMTEzODVAEnM090WcGzcHVbH0PYjGOdpeaPYJKwGByL1txB_mYFDjIQgYGs7n7bcUB8ZQh5J_X2E5Kj3ObgRXCGYKMfTdoBEME8EdY8_JiJKewOv4IpQdJQuKaIwn9eWzkuLFFsoAibefSHN4cwqEFv3lyHn87NRMB9ZNyc0pUl00dB7P-oQNVlWOQBuZ2vel2E75b1jWAvaK',
                domain: '.www.linkedin.com',
                path: '/',
                httpOnly: false,
                secure: true
            };
            await page.setCookie(cookie);
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.linkedin.com/',
            });

            try {
               

                await safeGoto(page,navigate_urls[Math.floor(Math.random() * navigate_urls.length)], { waitUntil: 'load', timeout: 20000 });
                await new Promise(r => setTimeout(r, pageDelays[Math.floor(Math.random() * pageDelays.length)]));
                

                await safeGoto(page,url1, {  waitUntil: 'networkidle2',  timeout: 20000000 });
               

                await page.waitForSelector('.account-top-card__account-actions', { timeout: 18000000 });
                await new Promise(r => setTimeout(r, 4000));

                const companyLink = await page.evaluate(() => {
                    const links = document.querySelector(".account-top-card__account-actions").children[0].children[3].href;
                    return { Link: links };
                });

                console.log(companyLink);
                resolve({ ...companyLink });
            } catch (error) {
                console.log(error);
                reject({ error: error });
            } finally {
                console.log("I am in finally");
                browser.close();
            }

            console.log(`All done, check the screenshots. ✨`);
        }).catch((err) => {
            console.log("I am error puputeer");
            console.log(err);
            reject(err);
            console.log("After error puputeer");
        })
    });
};

export default WebscrapingData;






















