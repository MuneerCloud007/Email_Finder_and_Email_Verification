import puppeteer from 'puppeteer-extra';
import requestPromise from 'request-promise';
import proxyChain from 'proxy-chain';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import puppeteer_extra_plugin_anonymize_ua from 'puppeteer-extra-plugin-anonymize-ua';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { timeout } from 'puppeteer-core';
import rimrafModule from 'rimraf';

const rimraf = promisify(rimrafModule);


puppeteer.use(StealthPlugin())


async function clearCache() {
    // Clear cache before launching Puppeteer
    await rimraf('./.cache/puppeteer');
}


puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

puppeteer.use(puppeteer_extra_plugin_anonymize_ua())


const pageValueArr = [];
pageValueArr.push("Page 0")


const userAgentStrings = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
];
const changeUserAgent = async () => {
    try {
        const data = await requestPromise({
            url: "http://lumtest.com/myip.json",
        })
        return JSON.parse(data).ip;
    } catch (err) {
        console.log(err);
    }



}


const getRandomUserAgent = () => {
    const randomIndex = Math.floor(Math.random() * userAgentStrings.length);
    return userAgentStrings[randomIndex];
};
const userAgent = getRandomUserAgent();


let dummy_arr = []
let data2;
const proxyURL = "http://scraperapi:0d7c0afd962ae53aca526f234a7604f2@proxy-server.scraperapi.com:8001"

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
// Create an array with delay values from 1s to 4s (1000ms to 4000ms) with at least 20 values including increments like 1.1s, 2.1s, etc.
const pageDelay = [];
for (let i = 1000; i <= 4000; i += 100) {
    pageDelay.push(i);
}

// Shuffle the array to ensure randomness and then select the first 20 values
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(pageDelay);


function getRandomPageDelay() {
    const randomIndex = Math.floor(Math.random() * pageDelay.length);
    return pageDelay[randomIndex];
}


const scrollArr = [100, 1100, 1200, 130, 140, 150, 1600, 1700, 1800, 100,
    200, 2100, 2200, 230, 2400, 2500, 260, 270, 2800, 2900, 3000,
    3100, 320, 330, 340, 3500, 360, 3700, 380, 390, 400


];

function getRandomScrollTime() {
    const randomIndex = Math.floor(Math.random() * scrollArr.length);
    return scrollArr[randomIndex];
}

const pageOne = [];
for (let i = 15; i < 27; i++) {
    pageOne.push(i);
}
function getPageOne() {
    const randomIndex = Math.floor(Math.random() * pageOne.length);
    return pageOne[randomIndex];
}
const navigate_url = [
    "https://www.geeksforgeeks.org/array-data-structure/",
    "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript",
    "https://www.codewars.com/collections/basic-js",
    "https://www.w3schools.com/jsref/jsref_obj_array.asp",
    "https://www.interviewbit.com/courses/programming/",
    "https://codeforces.com/problemset",
    "https://www.freecodecamp.org/learn/",
    "https://www.programiz.com/c-programming/examples",
    "https://www.educative.io/courses/grokking-the-coding-interview",
    "https://www.codecademy.com/learn/paths/web-development",
    "https://www.codementor.io/",
    "https://www.topcoder.com/community/competitive-programming/",
    "https://www.codesignal.com/",

];



async function navigateWithRetry(page, url, options, maxRetries = 3, retryDelay = 5000,) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            await page.goto(url, options);
            return; // Navigation successful, exit the function
        } catch (error) {
            console.error(`Error navigating to ${url}. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay), [6000]); // Wait before retrying
            retries++;
        }
    }
    console.error(`Failed to navigate to ${url} after ${maxRetries} retries.`);
}

function addPageBeforeQuery(url, page) {
    let queryIndex = url.indexOf('query=')
    if (queryIndex === -1) return url; // If 'query' is not found, return the original URL

    const newUrl = url.slice(0, queryIndex) + `page=${page}&` + url.slice(queryIndex);
    return newUrl;
}



function removePageParam(url) {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('page');
    return urlObj.toString();
}

async function getProxy() {
    const anonymizedProxy = await proxyChain.anonymizeProxy({ url: proxyURL });
    return anonymizedProxy;
}




async function getCertificateSPKIHash() {
    try {
        // Read the certificate file
        const certFile = fs.readFileSync('./luminati.io.cer', 'utf8');
        console.log(certFile);

        // Parse the certificate
        const cert = await forge.pki.certificateFromPem(certFile);

        // Calculate the SPKI hash
        const spki = await forge.pki.getPublicKeyFingerprint(cert.publicKey, {
            encoding: 'binary',
            md: forge.md.sha256.create()
        });

        // Convert SPKI hash to base64
        const spkiBase64 = Buffer.from(spki, 'binary').toString('base64');

        return spkiBase64;
    } catch (error) {
        console.error('Error reading certificate:', error);
        return ''; // Return an empty string if there's an error
    }
}









const WebscrapingData = (url1) => {
    return (new Promise(async (resolve, reject) => {
        await clearCache();
        console.log("I am inside the puputeer");


        puppeteer.launch({
            headless: true,
            args: [
                `--user-agent=${getRandomUserAgent()}`,
                '--disable-features=site-per-process',
                '--v=1',
            ],
            timeout: 600000,

            ignoreHTTPSErrors: true
        }).then(async browser => {
            const page = await browser.newPage()
            await page.setViewport({ width: 800, height: 600 })


            const cookie = {
                name: 'li_at',
                value: 'AQEFAQ8BAAAAAA_9W-EAAAGP8vkCmgAAAZAXBY8XVgAAsnVybjpsaTplbnRlcnByaXNlQXV0aFRva2VuOmVKeGpaQUFDbHFhTU15Q2EzWUJ0R29nV1ZQK3hrUkhFU09WY1hnaG1SSzV3ZFdGZ0JBQ2VrZ2VEXnVybjpsaTplbnRlcnByaXNlUHJvZmlsZToodXJuOmxpOmVudGVycHJpc2VBY2NvdW50Ojc1NjU1MzcyLDEyMDU4NzkyNiledXJuOmxpOm1lbWJlcjo4ODUyMTEzODVAEnM090WcGzcHVbH0PYjGOdpeaPYJKwGByL1txB_mYFDjIQgYGs7n7bcUB8ZQh5J_X2E5Kj3ObgRXCGYKMfTdoBEME8EdY8_JiJKewOv4IpQdJQuKaIwn9eWzkuLFFsoAibefSHN4cwqEFv3lyHn87NRMB9ZNyc0pUl00dB7P-oQNVlWOQBuZ2vel2E75b1jWAvaK',
                domain: '.www.linkedin.com',
                path: '/',
                httpOnly: true,
                secure: true
            };

            await page.setCookie(cookie);
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.linkedin.com/',

            });




            try {




                async function safeGoto(url, options) {
                    try {
                        await navigateWithRetry(page, url, options);
                    } catch (error) {

                        console.error('Navigation error:', error);
                    }
                }


                await safeGoto(navigate_url[Math.floor(Math.random() * navigate_url.length)], { waitUntil: 'load', timeout: 20000 });

                await delay(getPageOne());


                await safeGoto(url1, { waitUntil: 'load', timeout: 20000 });


                await page.waitForSelector('a', { timeout: 1800000 });

                const title = await page.evaluate(() => document.title);
                console.log(title);

                const links = await page.evaluate(() => {
                    const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
                    return links;
                });
                console.log(links); // Output the links  .artdeco-list
                await page.waitForSelector('.account-top-card__account-actions', { timeout: 18000000 });
                await delay(4000);



                const companyLink = await page.evaluate(() => {
                    const links = document.querySelector(".account-top-card__account-actions").children[0].children[3].href

                    return { Link: links };
                });

                console.log(companyLink);


                //Stage one

                let exec;

                await delay(4000);
                resolve({...companyLink})

                console.log("Loop is executed");



            } catch (error) {
                console.log(error);
                reject({ error: error });

                console.error('Error scraping LinkedIn profile:', error);
            } finally {
                await delay(1000)
                browser.close();


            }

            console.log(`All done, check the screenshots. ✨`)
        })
    }))
}
export default WebscrapingData;






















