
var convert = require('xml-js');
const { RequestQueue  } =require ('crawlee');

async function handler(page, context) {
    const { request: { userData: { start } } } = context
    const requestQueue = await RequestQueue.open();
    let data = []
    const url = await page.url()

    await page.waitForSelector('#Katalog')
    await page.waitForSelector('.productItem')
    const productItems = await page.evaluate(() => document.querySelectorAll('.productItem').length)
    const noMoreProducts = await page.evaluate(() => document.querySelector(".noMoreProducts").style.display === 'none')
    debugger
    if (productItems >= 20 && start) {

        await requestQueue.addRequest({ url: `${url}?page=2`, userData: { start: false } })

    } else if (productItems >= 20 && !start) {
        debugger
        const currentPage = url.substring(url.indexOf('='))
        const nextPage = parseInt(url.substring(url.indexOf('=') + 1)) + 1
        const nextUrl = url.replace(currentPage, `=${nextPage}`)
        debugger
        await requestQueue.addRequest({ url: nextUrl, userData: { start: false } })
    }

    if (productItems > 0) {
        data = await page.$$eval('.productItem', (productCards, _subcategory, _category, _opts, _node) => {
            return productCards.map(productCard => {
                const priceNew = productCard.querySelector('.currentPrice') ? productCard.querySelector('.currentPrice').textContent.replace(/\n/g, '').replace('₺', '').trim() : productCard.querySelector('.addPriceDiscount span').textContent.replace('₺', '').trim()
                const longlink = productCard.querySelector('a.fl').href
                const link = longlink.substring(longlink.indexOf("https://www.patirti.com/") + 24)
                const longImgUrl = productCard.querySelector('img').src ? productCard.querySelector('img').src : productCard.querySelector('img[data-bind]').src
                const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf("https://images.patirti.com/") + 27)
                const title = productCard.querySelector('m[data-bind]').innerHTML
                return {
                    title: 'patirti ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort, // imageUrlshort,
                    link,

                    timestamp: Date.now(),

                    marka: 'patirti',



                }
            }).filter(f=>f.priceNew)
        })
    }


    debugger

    console.log('data length_____', data.length, 'url:', url)

    const formatprice = data.map((m) => {
        return { ...m }
    })

    debugger
    return formatprice.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })






}







async function getUrls(page) {


    const pageUrls = []

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }

