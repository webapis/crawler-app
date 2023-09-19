

const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

 
    await autoScroll(page)
    debugger
    const data = await page.$$eval('.product-item-box', (productCards) => {
        return productCards.map(document => {
try {
    const title = document.querySelector('.product-name a').innerText
    const imageUrl= document.querySelector('.product-item-image').getAttribute('data-src')
    const priceNew =document.querySelector('.product-sale-price').innerText.replace('TL','').trim()
    const link = document.querySelector('.product-name a').href

    return {
        title: 'desa '+title.replace(/İ/g,'i').replaceAll('-',' ').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'desa',
    } 

} catch (error) {
    return{
        error:error.toString(),content:document.innerHTML
    }
}

        })
    })

return data


}


async function getUrls(page) {

    const pageUrls = []

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.list-content'
const linkSelector='.navigation-wrapper a'
const linksToRemove=[]
const hostname='https://www.desa.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

