

const Apify = require('apify');
async function handler(page, context) {
    const { request: { userData: { start } } } = context
    debugger;


    const url = await page.url()

    debugger;

    await page.waitForSelector('.ProductList')


    const requestQueue = await Apify.openRequestQueue();
    debugger
    const data = await page.$$eval('.Prd', (productCards) => {
        return productCards.map(document => {
            const priceNew =document.querySelectorAll('.PriceArea span')? Array.from(document.querySelectorAll('.PriceArea span')).reverse()[0].innerText.replace('TL', '').trim():null//.replace(',','.')
            const longlink =document.querySelector('button.AddToCart')? document.querySelector('button.AddToCart').getAttribute('data-producturl'):null
            const link = longlink?longlink.substring(1):null
            const longImgUrl =document.querySelector('[data-src]')? document.querySelector('[data-src]').getAttribute('data-src'):null
            const imageUrlshort =longImgUrl? longImgUrl.substring(longImgUrl.indexOf("https://cdn3.sorsware.com/") + 26):null
            const title =document.querySelector('button.AddToCart')? document.querySelector('button.AddToCart').getAttribute('data-productname') + ' ' + document.querySelector('button.AddToCart').getAttribute('data-colorname'):null
            return {
                title: 'bsl ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'bsl',
            }
        }).filter(f =>  f.title.length > 5)
    })
    const hasMore = await page.evaluate(() => document.querySelectorAll('.Prd').length >= 24)
    if (start && hasMore) {

        await requestQueue.addRequest({ url: url + '?p=2&ct=2&g=4', userData: { start: false } })
    } else {
        if (hasMore) {
            const prevPage = parseInt(url.substring(url.indexOf('p=') + 2, url.indexOf('&')))
            await requestQueue.addRequest({ url: url.replace(`?p=${prevPage}&ct=2&g=4`,`?p=${prevPage + 1}&ct=2&g=4`), userData: { start: false } })
        }

    }

    //----------

    console.log('data length_____', data.length, 'url:', url)

    debugger

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { handler, getUrls }

