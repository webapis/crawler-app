const Apify = require('apify');
var convert = require('xml-js');
var fetch = require('node-fetch')
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

        const jsondata = await convertXMLToJSON({ url })
        const sitemapUrl = jsondata['urlset']['url'].filter((f, i) => i > 0).map(m => m.loc._text)

        const requestQueue = await Apify.openRequestQueue();
        debugger;
        for (let u of sitemapUrl) {

            requestQueue.addRequest({ url: u, userData: { start: false } })
        }

        return []
    } else {
        //collect data
        debugger
        await page.waitForSelector('.ems-page-product-detail')
        debugger
        const data = await page.evaluate(() => {
           // const titleDetail = document.querySelectorAll('.urun-detay-ul li') ? Array.from(document.querySelectorAll('.urun-detay-ul li')).map(m => m.innerText).join(' ').replace('|', '') : ''
            const title = document.querySelector('.emos_H1').innerText
            const color = document.querySelector('.listeUrunDetayGrup_listeBaslik') ? document.querySelector('.listeUrunDetayGrup_listeBaslik').innerText.replace('Renk:', '').trim() : ''
            const priceNew = document.querySelector('[data-product-price]').innerText.replace('₺', '').trim()
            const imageUrl = document.querySelector('img[data-image-src]').src
            return {
                title: title  + " " + color,
                priceNew,
                imageUrl: imageUrl.substring(imageUrl.indexOf('https://img2-ipekyol.mncdn.com/mnresize') + 39),
                link: location.href,
                timestamp: Date.now(),
                marka: 'ipekyol',
            }
        })
        debugger
        console.log('data length_____', [data].length, 'url:', url)

        return [data].map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })

    }






}


async function getUrls(page, param) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}
module.exports = { handler, getUrls }