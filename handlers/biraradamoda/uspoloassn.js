
//const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.js-product-list-container',
    linkSelector:'.header__navigation a',
    linksToRemove:[],
    hostname:'https://tr.uspoloassn.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {


    const url = await page.url()


   // await autoScroll(page)
    debugger
    const data = await page.$$eval('.js-product-list-item', (productCards) => {
        return productCards.map(document => {
            const imageUrl =document.querySelector('.js-product-list-item img[data-src]') && document.querySelector('.js-product-list-item img[data-src]').getAttribute('data-src')
            const title = document.querySelector('.product__name a').innerText
            const priceNew = document.querySelector('.product__listing--basket-price span').innerText.replace('TL','').trim()
            const link = document.querySelector('.product__name a').href
         
            return {
                title: 'uspoloassn ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'uspoloassn',
            }
        })
    })
return data
}

async function getUrls(page) {
    const url = await page.url()
 const nextPage =   await page.$('.page-list-more')
 let productCount= 0
    const pageUrls = []
  
        if(nextPage){
             productCount= await page.evaluate(()=>Array.from(document.querySelectorAll('.page-list-more p span')).map(m=>m.innerText.replace(/[^\d]/g,'')).reverse()[0]) 
            const totalPages = Math.ceil(productCount / 24)
            for (let i = 2; i <= totalPages; i++) {
                pageUrls.push(`${url}?page=` + i)
            }
        }
   
    


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
