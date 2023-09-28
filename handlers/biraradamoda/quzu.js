const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'#ProductPageProductList',
    linkSelector:'.menu-list a',
    linksToRemove:[],
    hostname:'https://www.quzu.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page, context) {


    const url = await page.url()


    const acceptcookies = await page.$('.seg-popup-close')
    if (acceptcookies) {
        await page.click('.seg-popup-close')
    }
    await autoScroll(page)

    
                    const data = await page.$$eval('.productItem', (productCards,url) => {
                        try {
                            return productCards.map(productCard => {
                                const priceNew = productCard.querySelector('.discountPrice span').textContent.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
                                const link = productCard.querySelector('.productName a').href
                                const imageUrl = productCard.querySelector('img[data-original]').getAttribute('data-original')
                                const title = productCard.querySelector('.productName a').innerHTML
    
                                return {
                                    title: 'quzu ' + title.replace(/İ/g,'i').toLowerCase(),
                                    priceNew,//:priceNew.replace('.','').replace(',','.').trim(),
                                    imageUrl,
                                    link,
                                    timestamp: Date.now(),
                                    marka: 'quzu',
                      
                                }
                            })       
                        } catch (error) {
                            
                        }

                    },url)

          
    return data
}




async function getUrls(page) {

    const pageUrls = []



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

