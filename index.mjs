

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PuppeteerCrawler, Dataset,RequestQueue } =require('crawlee');
import { uploadCollection } from'./utils/uploadCollection.mjs'
require('dotenv').config()

    const requestQueue = await RequestQueue.open();
    const marka = process.env.marka// process.env.START_URL.match(/(?<=www.).*(?=.com)/g)[0]
    const website = process.env.WEBSITE
    console.log('main running')
    console.log('main', process.env.GENDER)
    const { urls } = require(`./urls/biraradamoda/${process.env.GENDER}/${marka}`)

    for (let obj of urls) {

        const { url, category, opts, node } = obj

        await requestQueue.addRequest({ url, userData: { start: true, category, opts, node } })

    }

    const productsDataset = await Dataset.open(`products`);

    process.env.dataLength = 0
    const handlePageFunction = async (context) => {


        const { page, request: { userData: { start, opts } } } = context


        const { handler, getUrls } = require(`./handlers/biraradamoda/${process.env.marka}`);
        const { pageUrls, productCount } = await getUrls(page)
        process.env.productCount = productCount

        if (start) {
            let order = 1
            for (let url of pageUrls) {
                if (pageUrls.length === order) {
                    requestQueue.addRequest({ url, userData: { start: false, opts, } })
                } else {
                    requestQueue.addRequest({ url, userData: { start: false, opts, } })
                }
                ++order;
            }
        }

        const dataCollected = await handler(page, context)
        const withError =dataCollected.filter(f=>f.error)
        if(withError.length>0){
            console.log('withError:length', withError.length)
            console.log('withError:error', withError[0].error)
            console.log('withError:content', withError[0].content)
           // throw 'Error when scraping'
            process.exit(1)
        }
            
        if (dataCollected.length > 0) {
            await productsDataset.pushData(dataCollected)

            process.env.dataLength = parseInt(process.env.dataLength) + dataCollected.length


        } else {
            console.log('unsuccessfull page data collection')

            // throw 'unsuccessfull data collection'
        }



    }


    const crawler = new PuppeteerCrawler({
        // requestList,
        requestQueue,
        maxConcurrency: 1,
      requestHandlerTimeoutSecs: 3600,
    //  maxRequestRetries:4,
        navigationTimeoutSecs: 240,
        launchContext: {
            // Chrome with stealth should work for most websites.
            // If it doesn't, feel free to remove this.
            useChrome: process.env.LOCAL==='TRUE'?true:false,
            launchOptions: {
                // defaultViewport: {
                //     width: 1920, // Desired width of the viewport
                //     height: 1080, // Desired height of the viewport
                //   },
              //  timeout: 0, // Set timeout to 0 to disable it
                // increase protocolTimeout value to a higher timeout
                // depending on your requirements
                // For example, set it to 30000 (30 seconds)
             //  protocolTimeout:process.env.marka==="bershka"?600000:60000,
                headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-web-security",
                   // `--window-size=1200,1250`,
                    "--allow-insecure-localhost",
                    //  "--user-data-dir=/tmp/foo",
                    "--ignore-certificate-errors",
                    "--unsafely-treat-insecure-origin-as-secure=https://localhost:8888",
                    '--disable-gpu-rasterization',
                    '--disable-low-res-tiling',
                    '--disable-skia-runtime-opts',
                    '--disable-yuv420-biplanar',
                    '--disable-site-isolation-trials',
                    '--disable-dev-shm-usage',
                    '--deviceScaleFactor=0.50',
                    //'--lang=en-US,en'
                    // '--shm-size=3gb'
                    '--window-size=1920,1080', '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"'
                ],
              //  env: { LANGUAGE: "en_US" }
            }

        },
        requestHandler:handlePageFunction,
        //  navigationTimeoutSecs:120,
        preNavigationHooks: [
            async (crawlingContext, gotoOptions) => {
                const base64Data = 'UklGRrQCAABXRUJQVlA4WAoAAAAgAAAAMQAAMQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggxgAAADAFAJ0BKjIAMgA+KRSIQqGhIRQEABgChLSAAfEUsMdoQDxm7V7DY8pOCS0L/ZyItlBAAP78SglvPhcQmHd7faO6y1Vj5rGK48w1Px+0DDzmSmSYzbIU4V+7Fe49Jdh1s8ufvov/DhqMdLRQIsmNpwliL2KKjX3y+AjM9IY6ZBHFt/K3ZB9a92c7eC4FhJPj8CGJNQiCXYBrv/s2nqpZap2xm8BBq/aPjDKYsaw5MG8/sgZVfdCc1IZY+bxPEQplrVSOwAAAAA=='
                const buffer = Buffer.from(base64Data, 'base64');
                const { page } = crawlingContext;

                await page.setDefaultNavigationTimeout(0);
                await page.setRequestInterception(true);

       
                page.on('request', req => {
                    const resourceType = req.resourceType();
                    const url = req.url();
                    if (resourceType === 'image' || (resourceType === 'fetch') ||url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif')|| url.endsWith('.webp')||url.endsWith("imformat=chrome")) {
                        req.respond({
                            status: 200,
                            contentType: 'image/jpeg',
                            body: buffer
                        });


                    } else {
                        req.continue();
                    }
                });
                page.on('response', async response => {
                    const request = response.request();



                    const status = response.status()
                    if (status === 200) {
                        try {
                            const text = await response.text()
                            if (isJsonString(text)) {


                                const json = JSON.parse(text);
                                if (Array.isArray(json)) {

                                    await Dataset.pushData({ arr: json });
                                       //response.continue();

                                } else {

                                    await Dataset.pushData(json);
                                       //response.continue();
                                }



                            }
                        } catch (error) {

                        }

                    }

                })
        
          
        
                function isJsonString(str) {
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }
            },
        ],
        handleFailedRequestFunction: async ({ request: { errorMessages, url, userData: { gender, start } } }) => {
  
        },
    });


    await crawler.run();
    const uniqify = (array, key) => array.reduce((prev, curr) => prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);


    const { items: productItems } = await productsDataset.getData();
    const withError =productItems.filter(f=>f.error)
    if(withError.length>0){
        console.log('withError:length', withError.length)
        console.log('withError:error', withError[0].error)
        console.log('withError:content', withError[0].content)
        throw 'Error when scraping'
    }else{
        console.log('total collected',productItems.length)
        const uniqueProductCollection = uniqify(productItems, 'imageUrl')
        console.log('uniqueProductCollection',uniqueProductCollection.length)
        productItems.forEach((f)=>{
            console.log('obj',f)
        })
        console.log('total collected--',productItems.length)
        console.log('uniqueProductCollection',uniqueProductCollection.length)

        var groupBy = function (xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        const groupByimageUrl = groupBy(productItems, 'imageUrl')

        for (let image in groupByimageUrl) {
            const curr = groupByimageUrl[image]
            image
            debugger
            if(curr.length>1){
                console.log('similar images',image,': ',curr.length)
            }
       
       
        }
        const mapGender = uniqueProductCollection.map((m => { return { ...m, gender: m.title.substring(m.title.lastIndexOf('_')) } }))
        const groupByGender = groupBy(mapGender, 'gender')
   
        for (let gender in groupByGender) {
            const curr = groupByGender[gender]
            let gnd = gender.replace('_', "")
            debugger
            await uploadCollection({ fileName: `${marka}`, data: curr, gender: gnd, marka })
            debugger
        }

        console.log('uploading git state')
        
    }


    console.log('Crawl finished.');





// import EventEmitter from 'events';
// import { Dataset } from 'crawlee';
// import { Semaphore } from 'async-mutex';
// import puppeteer from 'puppeteer';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// require('dotenv').config()
// class UrlEmitter extends EventEmitter { }

// const urlEmitter = new UrlEmitter();
// const marka = process.env.marka
// const { urls: links } = require(`./urls/biraradamoda/${process.env.GENDER}/${marka}`)
// const urls = links.map((m) => {
//   return { ...m, start: true }
// })
// const processedUrls = new Set(); // Track processed URLs
// const MAX_PARALLEL_EXECUTIONS = 1; // Maximum parallel executions
// const semaphore = new Semaphore(MAX_PARALLEL_EXECUTIONS); // Create a semaphore instance
// let browser; // Puppeteer browser instance

// async function scrape(urlObj, handler, maxRetries = 3) {
//   const { url } = urlObj;

//   for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
//     try {
//       await customHandler(urlObj);
//       return; // Successful, exit the function
//     } catch (error) {
//       console.log(`Scraping failed for ${url}. Retrying (${retryCount}/${maxRetries})...`);
//     }
//   }
//   console.log(`Scraping failed for ${url} after ${maxRetries} retries.`);
// }

// async function customHandler(urlObj) {
//   const { url, start } = urlObj;
//   const page = await browser.newPage();
//  await page.setRequestInterception(true);

//   await page.setViewport({ width: 1024, height: 768 });
//   // See if JavaScript is enabled
//   const isJavaScriptEnabled = await page.evaluate(() => {
//     return window.navigator.userAgent.indexOf('WebKit') !== -1;
//   });

//   console.log('isJavaScriptEnabled',isJavaScriptEnabled); // true
//   const isCssEnabled = await page.evaluate(() => {
//     return document.querySelector('html').style.fontSize !== undefined;
//   });

//   console.log('isCssEnabled',isCssEnabled); // true





  
//   try {
//     const randonjsonDataset = await Dataset.open();
//     const base64Data = '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'
//     const buffer = Buffer.from(base64Data, 'base64');

//     await page.setDefaultNavigationTimeout(0);
//     await page.setRequestInterception(true);
//     page.on('request', req => {
//       req.mode = 'no-cors';
//      // req.headers['Access-Control-Allow-Origin'] = '*';
//       const resourceType = req.resourceType();

//       if (resourceType === 'image' || (resourceType === 'fetch')) {
//         req.respond({
//           status: 200,
//           contentType: 'image/jpeg',
//           body: buffer
//         });


//       } else {
//         req.continue();
//       }
//     });
//     page.on('response', async response => {
//       const request = response.request();


//       const status = response.status()
//       const url = response.url()


//       if (status === 200) {
//         try {
//           const text = await response.text()
//           if (isJsonString(text)) {


//             const json = JSON.parse(text);
//             if (Array.isArray(json)) {

//               await randonjsonDataset.pushData({ arr: json });
//               //   response.continue();

//             } else {

//               await randonjsonDataset.pushData(json);
//               //   response.continue();
//             }



//           }
//         } catch (error) {

//         }

//       }

//     })
//     function isJsonString(str) {
//       try {
//         JSON.parse(str);
//       } catch (e) {
//         return false;
//       }
//       return true;
//     }
//     await page.goto(url);

//     const { handler, getUrls } = require(`${process.cwd()}/handlers/biraradamoda/${process.env.marka}`);
//     const { pageUrls } = await getUrls(page)
//     const datasetDefault = await Dataset.open()
//     const data = await handler(page, { addUrl, dataset: datasetDefault, start: true })
//     const dataset = await Dataset.open('products')
//     await dataset.pushData(data)
//     if (start) {
//       for (let url of pageUrls) {
//         if (pageUrls.length > 0) {
//           addUrl({ url, start: false })
//         }
//       }
//     }


//     // Perform page scraping using Puppeteer
//     // Add your scraping logic here
//     const pageTitle = await page.title();
//     console.log(`Scraped title for ${url}: ${pageTitle}`);
//   } catch (error) {
//     console.log(`Error occurred while scraping ${url}: ${error}`);
//   } finally {
//     await page.close();
//   }

//   return
// }

// function addUrl(urlObj) {
//   const { url } = urlObj;

//   if (!processedUrls.has(url)) {
//     processedUrls.add(url);
//     urls.push(urlObj);
//     debugger
//     urlEmitter.emit('urlAdded', urlObj);
//   }
// }

// urlEmitter.on('urlAdded', async (urlObj) => {
//   await semaphore.acquire();
//   try {
//     if (!processedUrls.has(urlObj.url)) {
//       await scrape(urlObj);
//     }

//   } finally {
//     semaphore.release();
//   }
// });

// (async () => {

//   // browser = await puppeteer.launch({ headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
//   browser = process.env.LOCAL === 'TRUE' ? await puppeteer.launch({ headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' }) : await puppeteer.launch()
//   for (const urlObj of urls) {
//     await semaphore.acquire();
//     try {
//       debugger
//       await scrape(urlObj);
//     } finally {
//       semaphore.release();
//     }
//   }

//   await browser.close();
// })();

// console.log(urls);
