
import { RequestQueue  } from 'crawlee';
const requestQueue = await RequestQueue.open();
async function handler(page, context) {
    const { request: { userData: { start } } } = context

    const url = await page.url()
    let data = []
    await page.waitForSelector('.catalogWrapper')
    await page.waitForSelector('.ttl-pro')

    const totalProducts = await page.evaluate(() => parseInt(document.querySelector('.ttl-pro').innerText.replace(/[^\d]/g, '')))
    const collectedProducts = await page.evaluate(() => document.querySelectorAll('#category-list .imgInner').length)
  
    if (collectedProducts >= totalProducts) {
        debugger
        data = await page.$$eval('.productItem', (productCards) => {
            return productCards.map(document => {
                const imageUrl = document.querySelector('.imgInner img').src
                const title = document.querySelector('a.detailLink [title]').getAttribute('title').trim()
                const priceNew = document.querySelector('.discount-in-basket-price span') ? document.querySelector('.discount-in-basket-price span').innerText.replace('₺', '').trim() : document.querySelector('.currentPrice').innerText.replace('₺', '').trim()
                const longlink = document.querySelector('.detailLink').href
                const link = longlink.substring(longlink.indexOf("https://sarar.com/") + 18)
                const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://cdn.sarar.com/") + 22)
                return {
                    title: 'sarar ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'sarar',
                }
            }).filter(f => f.imageUrl !== null && f.title.length > 5)
        })
        console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

        debugger
        console.log("process.env.GENDER ")
        const mapgender = data.map((m) => {
            return { ...m, title: m.title + " _" + process.env.GENDER }
        })
        return mapgender

    } else {
        if (start) {
            const nextUrl = url + `?ps=2`
  
            await requestQueue.addRequest({ url: nextUrl, userData: { start: false } })
            return []
        } else {
            const prevPageNumber = parseInt(url.substring(url.indexOf('?ps=') + 4))
            const nextUrl = url.replace(`?ps=${prevPageNumber}`, `?ps=${prevPageNumber + 1}`)
       
            await requestQueue.addRequest({ url: nextUrl, userData: { start: false } })
            return []
        }
    }







}

async function getUrls(page) {


    return { pageUrls:[], productCount: 0, pageLength: 0 }
}
module.exports = { handler, getUrls }