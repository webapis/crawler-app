import { PuppeteerCrawler, Dataset,RequestQueue  } from 'crawlee';
import { createRequire } from 'module';
import launchContext from './crawler/launchContext.mjs';
import preNavigationHooks from './crawler/preNavigationHooks.mjs';
import handlePageFunction from './crawler/handlePageFunction.mjs'
const requestQueue = await RequestQueue.open();
//datasetIdOrName
const require = createRequire(import.meta.url);
require('dotenv').config()
const marka = process.env.marka
const { urls } = require(`./urls/biraradamoda/${process.env.GENDER}/${marka}`)
debugger


const productsDataset = await Dataset.open(`products`);
await Dataset.open();
process.env.dataLength = 0

const crawler = new PuppeteerCrawler({
    // Use the requestHandler to process each of the crawled pages.
     requestHandler:handlePageFunction,
                  launchContext,
                preNavigationHooks,


});
for (let obj of urls) {

    const { url, category, opts, node } = obj

    await crawler.addRequests([{ url, userData: { start: true, category, opts, node } }])

}
// Add first URL to the queue and start the crawl.
await crawler.run();

const { items: productItems } = await productsDataset.getData();

console.log('data collected',productItems.length)
