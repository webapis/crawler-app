
const initValues ={
    productPageSelector:'.cl-product-grid',
    linkSelector:'.nav-menu a',
    linksToRemove:[],
    hostname:'https://www.wrangler.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
 
    const url = await page.url()

    const data = await page.$$eval('.cl-product-box-container', (productCards,url) => {
        return productCards.map(document => {
try {
    const imageUrl = document.querySelector('.cl-product-images img[data-src]').getAttribute('data-src')
    const title = document.querySelector('.cl-product-images').getAttribute('title')
    const priceNew = document.querySelector('.cl-product-price').innerText.replace('TL','').trim()
    const link = document.querySelector('.cl-product-images').href


    return {
        title: 'wrangler ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'wrangler',
    }
} catch (error) {
    return { error: error.toString(),url, content: document.innerHTML };
}

        })
    },url)

return data
}

async function getUrls(page) {
    const url = await page.url()
   const nextPage = await page.$('.cl-product-grid-length')
   let productCount =0
    const pageUrls = []

  if(nextPage){
     productCount = await page.evaluate(()=>parseInt(document.querySelector(".cl-product-grid-length").innerText.replace(/[^\d]/g,'')))
    const totalPages = Math.ceil(productCount / 48)
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?pagenumber=` + i)

    }
  }


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
