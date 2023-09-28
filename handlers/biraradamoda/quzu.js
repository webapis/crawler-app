
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

                    const data = await page.$$eval('.productItem', (productCards) => {
                        return productCards.map(productCard => {
                            const priceNew = productCard.querySelector('.discountPrice span').textContent.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
                            const longlink = productCard.querySelector('.productName a').href
                            const link = longlink.substring(longlink.indexOf("https://www.quzu.com.tr/") + 24)
                            const longImgUrl = productCard.querySelector('img[data-original]') &&  productCard.querySelector('img[data-original]').getAttribute('data-original')
                            //const imageUrlshort = longImgUrl&& longImgUrl.substring(longImgUrl.indexOf('https://www.quzu.com.tr/') + 24)
                            const title = productCard.querySelector('.productName a').innerHTML

                            return {
                                title: 'quzu ' + title.replace(/İ/g,'i').toLowerCase(),
                                priceNew,//:priceNew.replace('.','').replace(',','.').trim(),
                                imageUrl: longImgUrl,
                                link,
                                timestamp: Date.now(),
                                marka: 'quzu',
                  
                            }
                        })
                    })

          
    return data
}




async function getUrls(page) {

    const pageUrls = []



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

