var convert = require('xml-js');
var fetch = require('node-fetch')

const Apify = require('apify');

async function convertXMLToJSON({ url }) {
    const response = await fetch(url)

    const xml = await response.text()

    var result1 = convert.xml2json(xml, { compact: true, spaces: 4 });

    const jsondata = JSON.parse(result1)
debugger
    return jsondata
}
async function handler(page, context) {



    const { request: { userData: { start } } } = context

    const url = await page.url()



    if (start) {
        const requestQueue = await Apify.openRequestQueue();
        const jsondata = await convertXMLToJSON({ url })

        const sitemapUrl = jsondata['sitemapindex']['sitemap'].filter(f => f.loc._text.includes('sitemap-products')).map(m => m.loc._text)
        debugger
        const jsondata2 = await convertXMLToJSON({ url: sitemapUrl })
        const productURLs = jsondata2['urlset']['url'].map(m => m.loc._text).filter(f => f.includes(process.env.GENDER))
debugger
        for (let url of productURLs) {
            await requestQueue.addRequest({ url, userData: { start: false } })
        }
        return []
    } else {
        debugger
        await page.waitForSelector('.container-product-detail')
        await page.waitForSelector('[data-popup="1"] img')
        debugger
        let data = await page.evaluate(() => {
            const priceNew = document.querySelector(".product-detail__sale-price").innerHTML.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
            const longlink =location.href
            const link = longlink.substring(longlink.indexOf("https://www.desa.com.tr/") + 24)
            const longImgUrl = document.querySelector('[data-popup="1"] img').src
            const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://14231c.cdn.akinoncloud.com/') + 35)
            const title = document.querySelector(".product-detail__name").innerHTML
            return [{
                title: 'desa ' + title.replace(/İ/g, 'i').toLowerCase(),//,+ (_opts.keyword ? (title.toLowerCase().includes(_opts.keyword) ? '' : ' ' + _opts.keyword) : ''),
                priceNew,
                imageUrl: longImgUrl,
                link,
                timestamp: Date.now(),
                marka: 'desa',

            }]

        })
        const formatedData =data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
        debugger

        console.log('data length_____', formatedData.length, 'url:', url)
        return formatedData

    }






}





async function manualScroll(page) {
    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 100;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });
}

async function getUrls(page) {

    const pageUrls = []



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }