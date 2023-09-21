
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
     productPageSelector:'.catalog',
     linkSelector:'#sitemap a',
     linksToRemove:[],
     hostname:'https://shop.mango.com/',
     exclude:[],
     postFix:''
}



async function extractor(page) {

await autoScroll(page)

const data = await page.$$eval('[id^="product-key-id"]', (productCards) => {
    return productCards.map( document => {
        try {
            // const imageUrl =document.querySelector('img')? document.querySelector('img').src:document.querySelector('img["original"]').getAttribute("original")
            // const title = document.querySelector('img')? document.querySelector('img').alt:document.querySelector('img["original"]').alt
            // const priceNew = document.querySelector('[data-testid=currentPrice] span').innerText.replace('TL','').trim()
            // const link = document.querySelector('a').href
  
            return {
                title: document.innerHTML //  'mango'+' ' + title.replace(/İ/g,'i').toLowerCase(),
                // priceNew,
                // imageUrl,
                // link,
                // timestamp: Date.now(),
                // marka:'mango',
            }  
        } catch (error) {
            return {error:error.toString(),content:document.innerHTML}
        }
    })
})
return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { extractor, getUrls,...initValues }
