
var fetch = require('node-fetch')
var convert = require('xml-js');
const Apify = require('apify');

async function convertXMLToJSON({ url }) {
    const response = await fetch(url)

    const xml = await response.text()

    var result1 = convert.xml2json(xml, { compact: true, spaces: 4 });

    const jsondata = JSON.parse(result1)

    return jsondata
}

async function fetProductsSiteMap(url) {

    const jsondata = await convertXMLToJSON({ url })

    const sitemapUrl = jsondata['urlset']['url'].map(m => m.loc._text)

    return sitemapUrl

}

async function handler(page, context) {
    const { request: { userData: { start } } } = context
    const url = await page.url()
    const requestQueue = await Apify.openRequestQueue();
    let data = []
    if (start) {
        const jsondata = await convertXMLToJSON({ url })
        const sitemapUrl = jsondata['sitemapindex']['sitemap'].map(m => m.loc._text).filter(f => f.includes('_product'))
        debugger
        let promise = []

        for (let p of sitemapUrl) {
            promise.push(await fetProductsSiteMap(p))
        }

        const productsSiteMaps = await Promise.all(promise.flat())

        for (let url of productsSiteMaps) {
            await requestQueue.addRequest({ url, userData: { start: false } })
        }
        return data

    } else {

        await page.waitForSelector('#productContent')
        await page.waitForSelector('#ProductImagesLightGallery img')

        data = await page.evaluate(() => {

            const priceNew = document.querySelector('.currentPrice') ? document.querySelector('.currentPrice').textContent.replace(/\n/g, '').replace('₺', '').trim() : document.querySelector('.addPriceDiscount span').textContent.replace('₺', '').trim()
            const longlink = location.href
            const link = longlink.substring(longlink.indexOf("https://www.patirti.com/") + 24)
            const longImgUrl = document.querySelectorAll('#ProductImagesLightGallery img')[0].src
            const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf("https://images.patirti.com/") + 27)
            const title = document.querySelector('#productName').innerText
            const color = document.querySelectorAll('.productAttrItem b')[1].textContent
            const gender = document.querySelector('.productAttrItem b').textContent.toLowerCase().replace('kadın','kadin')
            return [{
                title: 'patirti ' + title.replace(/İ/g, 'i').toLowerCase() +" "+ color +" "+ "_"+gender,
                priceNew,
                imageUrl: imageUrlshort, // imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'patirti',
            }]
        })

        console.log('data length_____', data.length, 'url:', url)

        const formatprice = data.map((m) => {
            return { ...m }
        })


        return formatprice






    }
}






async function getUrls(page) {


    const pageUrls = []

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }

