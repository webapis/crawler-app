
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

   // await autoScroll(page)



    const data = await page.$$eval('.ItemOrj', (productCards) => {
        return productCards.map(document => {
            try {
                const title = document.querySelector('a.detailUrl').getAttribute('title')
                const imageUrl= document.querySelector('a.detailUrl img[data-original]').getAttribute('data-original')
                const priceNew =document.querySelector('.discountPrice').innerText.replace('TL','').trim()
                const link = document.querySelector('a.detailUrl').href
 
             return {
                    title:'fashionfriends '+title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'fashionfriends',
             }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
         
        })
    })

    return data
}



async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='#ProductListMainContainer'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.fashionfriends.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

