import EventEmitter from 'events';
import { Semaphore } from 'async-mutex';
import puppeteer from 'puppeteer';

class UrlEmitter extends EventEmitter {}

const urlEmitter = new UrlEmitter();
const urls = [
  { url: 'https://example.com' },
  { url: 'https://example.org' },
  { url: 'https://example.net' },
  { url: 'https://demo.com' },
  { url: 'https://demo.org' },
  { url: 'https://demo.net' },
  { url: 'https://test.com' },
  { url: 'https://test.org' },
  { url: 'https://test.net' },
  { url: 'https://sample.com' }
];

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
    // Perform page scraping using Puppeteer
    // Add your scraping logic here
    const pageTitle = await page.title();
    console.log(`Scraped title for ${url}: ${pageTitle}`);
  } catch (error) {
    console.log(`Error occurred while scraping ${url}: ${error}`);
  } finally {
    await page.close();
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    addUrl({ url: 'https://www.dericeket.com.tr/yelek-28' });
  });
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
