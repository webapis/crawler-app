import { PuppeteerCrawler, Dataset, RequestQueue } from 'crawlee';
import { createRequire } from 'module';
import launchContext from './crawler/launchContext.mjs';
import preNavigationHooks from './crawler/preNavigationHooks.mjs';
import handlePageFunction from './crawler/handlePageFunction.mjs'

const require = createRequire(import.meta.url);
require('dotenv').config()
const marka = process.env.marka
const { urls } = require(`./urls/biraradamoda/${process.env.GENDER}/${marka}`)
debugger


await Dataset.open();
process.env.dataLength = 0

const crawler = new PuppeteerCrawler({
    // Use the requestHandler to process each of the crawled pages.
    requestHandler: handlePageFunction,
    launchContext,
    preNavigationHooks,
    maxConcurrency: 1,
    requestHandlerTimeoutSecs:3600,
    navigationTimeoutSecs:240,


});
for (let obj of urls) {

    const { url, category, opts, node } = obj

    await crawler.addRequests([{ url, userData: { start: true, category, opts, node } }])

}
// Add first URL to the queue and start the crawl.
await crawler.run();
const productsDataset = await Dataset.open(`products`);
const { items: productItems } = await productsDataset.getData();

console.log('data collected', productItems.length)



// PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install --production

/*
class CustomPuppeteerCrawler extends PuppeteerCrawler {
  async launchPuppeteer() {
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'wss://chrome.browserless.io?token=b3560d69-34cb-48de-84fe-cd346f63b0c4',
      // Add any other Puppeteer options as needed
    });

    return browser;
  }
}
*/