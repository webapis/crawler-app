import EventEmitter from 'events';
import { Semaphore } from 'async-mutex';
import puppeteer from 'puppeteer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config()
class UrlEmitter extends EventEmitter { }

const urlEmitter = new UrlEmitter();
const marka = process.env.marka
const { urls} = require(`./urls/biraradamoda/${process.env.GENDER}/${marka}`)


const processedUrls = new Set(); // Track processed URLs
const MAX_PARALLEL_EXECUTIONS = 3; // Maximum parallel executions
const semaphore = new Semaphore(MAX_PARALLEL_EXECUTIONS); // Create a semaphore instance
let browser; // Puppeteer browser instance

async function scrape(urlObj, handler, maxRetries = 3) {
  const { url } = urlObj;

  for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
    try {
      await handler(urlObj);
      return; // Successful, exit the function
    } catch (error) {
      console.log(`Scraping failed for ${url}. Retrying (${retryCount}/${maxRetries})...`);
    }
  }
  console.log(`Scraping failed for ${url} after ${maxRetries} retries.`);
}

async function customHandler(urlObj) {
  const { url } = urlObj;
  const page = await browser.newPage();
  try {
    await page.goto(url);

    const { handler, getUrls } = require(`${process.cwd()}/handlers/biraradamoda/${process.env.marka}`);
    const { pageUrls } = await getUrls(page)
    const data = await handler(page, { addUrl })

    for (let url of pageUrls) {
      if (pageUrls.length > 0) {
        addUrl({ url, userData: { start: false } })
      }
    }

    // Perform page scraping using Puppeteer
    // Add your scraping logic here
    const pageTitle = await page.title();
    console.log(`Scraped title for ${url}: ${pageTitle}`);
  } catch (error) {
    console.log(`Error occurred while scraping ${url}: ${error}`);
  } finally {
    await page.close();
  }

  return
}

function addUrl(urlObj) {
  const { url } = urlObj;

  if (!processedUrls.has(url)) {
    processedUrls.add(url);
    urls.push(urlObj);
    urlEmitter.emit('urlAdded', urlObj);
  }
}

urlEmitter.on('urlAdded', async (urlObj) => {
  await semaphore.acquire();
  try {
    await scrape(urlObj, customHandler);
  } finally {
    semaphore.release();
  }
});

(async () => {

  browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });

  for (const urlObj of urls) {
    await semaphore.acquire();
    try {
      await scrape(urlObj, customHandler);
    } finally {
      semaphore.release();
    }
  }

  await browser.close();
})();

console.log(urls);
