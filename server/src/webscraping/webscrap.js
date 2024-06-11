



import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import puppeteer_extra_plugin_anonymize_ua from 'puppeteer-extra-plugin-anonymize-ua';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import rimrafModule from 'rimraf';
import chromium from "@sparticuz/chromium";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const rimraf = promisify(rimrafModule);
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(puppeteer_extra_plugin_anonymize_ua());

async function clearCache() {
    await rimraf('./.cache/puppeteer');
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
        console.log(chromium.headless);
        console.log(await chromium.executablePath());

        puppeteer.launch({
            defaultViewport: chromium.defaultViewport,
            headless: true,
            args: [
                `--user-agent=${getRandomUserAgent()}`,
                '--disable-features=site-per-process',
                '--v=1',
            ],
            timeout: 600000,
            ignoreHTTPSErrors: true
        }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({ width: 800, height: 600 });

            
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
                        await page.goto(url, options);
                    } catch (error) {
                        console.error('Navigation error:', error);
                    }
                }

                await safeGoto(navigate_urls[Math.floor(Math.random() * navigate_urls.length)], { waitUntil: 'load', timeout: 20000 });
                await new Promise(r => setTimeout(r, pageDelays[Math.floor(Math.random() * pageDelays.length)]));

                await safeGoto(url1, { waitUntil: 'load', timeout: 20000 });
                await page.waitForSelector('a', { timeout: 1800000 });

                const title = await page.evaluate(() => document.title);
                console.log(title);

                const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.href));
                console.log(links);

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
                await new Promise(r => setTimeout(r, 1000));
                browser.close();
            }

            console.log(`All done, check the screenshots. ✨`);
        }).catch((err)=>{
            console.log("I am error puputeer");
            console.log(err);
            console.log("After error puputeer");
        })
    });
};

export default WebscrapingData;





















