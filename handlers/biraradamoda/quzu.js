const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.product-grid',
    linkSelector:'.menu-list a',
    linksToRemove:[],
    hostname:'https://quzu.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    const url = await page.url()
    debugger
    const acceptcookies = await page.$('.seg-popup-close')
    if (acceptcookies) {
        await page.click('.seg-popup-close')
    }

    await autoScroll(page)
    debugger
                    const data = await page.$$eval('.card', (productCards,url) => {
                        try {
                            return productCards.map(document => {
                                const priceNew = document.querySelector('.price-item--sale')? document.querySelector('.price-item--sale').innerText.replace('TL','').replaceAll('\n','').trim():document.querySelector('.price-item--regular').innerText.replace('TL','').replaceAll('\n','').trim()
                                const link = document.querySelector('.card a').href
                                const imageUrl ="https://"+ document.querySelector('.card a img').srcset.split(',')[1].trim().split(' ')[0]
                                const title = document.querySelector('.card a img').alt
    
                                return {
                                    title: 'quzu ' + title.replace(/İ/g,'i').toLowerCase(),
                                    priceNew,
                                    imageUrl,
                                    link,
                                    timestamp: Date.now(),
                                    marka: 'quzu',
                                }
                            })       
                        } catch (error) {

                            return {error:error.toString(),url,content:document.content}
                        }
                    },url)
                    debugger
    return data
}


async function getUrls(page) {

    const pageUrls = []

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

