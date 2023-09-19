
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

await autoScroll(page)
 
                    const data = await page.$$eval('.productbox.clearfix.list-item', (productCards) => {
                        return productCards.map(productCard => {
                            const title = productCard.querySelector('.lazy-image.product-name.track-link').getAttribute('title')
                            const imageUrl =productCard.querySelector('.lazy-image.product-name.track-link img')&& productCard.querySelector('.lazy-image.product-name.track-link img').src
                            const priceNew = productCard.querySelector('.product-price') ? productCard.querySelector('.product-price').innerHTML.replace('TL', '').trim() : productCard.querySelector('.product-new-price').innerHTML.replace('TL', '').trim()
                            const link = productCard.querySelector('.lazy-image.product-name.track-link').href

                            return {
                                title: 'colins ' + title.replace(/İ/g, 'i').toLowerCase(),
                                priceNew: priceNew,//.replace(',','.'),
                                imageUrl,
                                link,
                                timestamp: Date.now(),
                                marka: 'colins',

                            }
                        })
                    })
             

                  return  data
              debugger


                }

      
 
                const productPageSelector='.product-list'
                const linkSelector='#defaultmenu a'
                const linksToRemove=[]
                const hostname='https://www.colins.com.tr/'
                const exclude=[]
                const postFix =''

async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

