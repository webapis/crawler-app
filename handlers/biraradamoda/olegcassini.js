
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.desktop-filters',
    linkSelector:'.nav-links a',
    linksToRemove:[],
    hostname:'https://olegcassini.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
//sell-price
    const url = await page.url()
debugger
await autoScroll(page)
                              const data = await page.$$eval('[data-id]', (productCards,url) => {
                                try {
                                    return productCards.map(document => {
                                        const priceNew =document.querySelector('.discount-price')?  Array.from(document.querySelectorAll('.discount-price span')).reverse()[0].innerText.replace('₺','').trim(): document.querySelector('.sell-price').innerText.replace('₺','').trim()
                                        const link = document.querySelector('a').href
                                   
                                        const imageUrl = document.querySelector('img').src//  document.querySelector('[srcset]').getAttribute('srcset').split(',')[10].trim().split(' ')[0]//:document.querySelector('img').src
                        
                                        const title = document.querySelector('.product-name').innerText
                                        return {
                                            title: 'olegcassini ' + title.replace(/İ/g,'i').toLowerCase(),
                                             priceNew,
                                            imageUrl,
                                            link,
                                             timestamp: Date.now(),
                                            marka: 'olegcassini',
                                        }
                                    })
                                } catch (error) {
                                    return {error:error.toString(),url,content:document.innerHTML}
                                }
                            },url)

                            debugger
return data.filter(f=> !f.imageUrl.includes('/gif'))
debugger
                    
}





async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}





module.exports = { extractor, getUrls,...initValues }