import EventEmitter from 'events';
import { Semaphore } from 'async-mutex';

class UrlEmitter extends EventEmitter {}

const urlEmitter = new UrlEmitter();
const urls = [
  'https://example.com',
  'https://example.org',
  'https://example.net',
  'https://demo.com',
  'https://demo.org',
  'https://demo.net',
  'https://test.com',
  'https://test.org',
  'https://test.net',
  'https://sample.com'
];

const processedUrls = new Set(); // Track processed URLs
const MAX_PARALLEL_EXECUTIONS = 5; // Maximum parallel executions
const semaphore = new Semaphore(MAX_PARALLEL_EXECUTIONS); // Create a semaphore instance

async function scrape(url, handler, maxRetries = 3) {
  for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
    try {
      await handler(url);
      return; // Successful, exit the function
    } catch (error) {
      console.log(`Scraping failed for ${url}. Retrying (${retryCount}/${maxRetries})...`);
    }
  }
  console.log(`Scraping failed for ${url} after ${maxRetries} retries.`);
}

async function customHandler(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Hello, " + url + "!");
      resolve();
    }, 1000);
  }).then(() => {
    addUrl('https://example-new.com+5');
  });
}

function addUrl(url) {
  if (!processedUrls.has(url)) { // Check if URL is not already processed
    processedUrls.add(url); // Mark URL as processed
    urls.push(url);
    urlEmitter.emit('urlAdded', url);
  }
}

urlEmitter.on('urlAdded', async (url) => {
  await semaphore.acquire(); // Acquire a permit from the semaphore
  try {
    await scrape(url, customHandler);
  } finally {
    semaphore.release(); // Release the permit back to the semaphore
  }
});

(async () => {
  const locks = [];

  for (const url of urls) {
    await semaphore.acquire(); // Acquire a permit from the semaphore

    try {
      await scrape(url, customHandler);
    } finally {
      semaphore.release(); // Release the permit back to the semaphore
    }
  }
})();

console.log(urls);

