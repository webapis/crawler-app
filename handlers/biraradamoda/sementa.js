
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'[data-product-id]',
    linkSelector:'#main-nav a',
    linksToRemove:[],
    hostname:'https://www.sementa.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    debugger;
    const url = await page.url()


 
    await autoScroll(page)
debugger
    const data = await page.$$eval('[data-product-id]', (productCards,url) => {
        return productCards.map(document => {

            try {
                const title = document.querySelector('.product-link').getAttribute('aria-label')
                const imageUrl = document.querySelector('[data-lazy-bgset-src]')? 'https:'+ document.querySelector('[data-lazy-bgset-src]').getAttribute('data-lazy-bgset-src'):"https:"+ document.querySelector('.product-link [data-srcset]').getAttribute('data-srcset').split(',')[5].trim().split(' ')[0]
                const priceNew = document.querySelector('.product-price__item').innerText.replaceAll('\n','').replace("TL",'')
                const link = document.querySelector('.product-link').href
    
                return {
                    title: 'sementa ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew: priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'sementa',
    
                }      
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }

        })
    },url)
debugger

    return data


}





async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
