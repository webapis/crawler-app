const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
  productPageSelector:'.product-card',
  linkSelector:'.pre-desktop-menu a',
  linksToRemove:[],
  hostname:'https://www.nike.com/',
  exclude:[],
  postFix:''
}
async function extractor(page) {


    const url = await page.url()
debugger

 await autoScroll(page)
debugger
    const data = await page.$$eval('.product-card', (productCards,url) => {
        return productCards.map(document => {
try {
  const imageUrl = document.querySelector('.product-card__hero-image').src
  const title = document.querySelector('.product-card__hero-image').alt
  const priceNew = document.querySelector('[data-testid="product-price-reduced"]') ?document.querySelector('[data-testid="product-price-reduced"]').innerText.replace('₺',''):document.querySelector('[data-testid="product-price"]').innerText.replace('₺','')
  const link = document.querySelector('.product-card__link-overlay').href

  return {
      title: 'nike ' + title.replace(/İ/g, 'i').toLowerCase(),
      priceNew,
      imageUrl,
      link,
      timestamp: Date.now(),
      marka: 'nike',
  }
} catch (error) {
  return {error:error.toString(),url,content:document.innerHTML}
}
      
        })
    },url)

return data
}

async function getUrls(page) {
 
    const pageUrls = []
    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }