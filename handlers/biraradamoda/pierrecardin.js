
const initValues ={
    productPageSelector:'.product__listing',
    linkSelector:'.header__navigation a',
    linksToRemove:[],
    hostname:'https://www.pierrecardin.com.tr',
    exclude:[],
    postFix:''
  }
async function extractor(page) {


    const url = await page.url()

 

    const data = await page.$$eval('.js-product-list-item', (productCards,url) => {
        return productCards.map(document => {
                try {
                    const imageUrl = document.querySelectorAll('a img[data-src]').length >0? document.querySelectorAll('a img[data-src]')[0].getAttribute('data-src'):null
                    const title = document.querySelector('.product__listing--content a').text.trim()
                    const priceNew = document.querySelector('.product__listing--basket-price span')? document.querySelector('.product__listing--basket-price span').innerText.replace('TL','').trim():(document.querySelector('.product__listing--price ins')?document.querySelector('.product__listing--price ins').innerText.replace('TL','').trim() :document.querySelector('.lone-price').innerText.replace('TL','').trim() )
                    const link = document.querySelector('.product__listing--content a').href
              
                    return {
                        title: 'pierrecardin ' + title.replace(/İ/g, 'i').toLowerCase(),
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'pierrecardin',
                    }   
                } catch (error) {
                    return {error:error.toString(),url,content:document.innerHTML}
                }
      
        })
    },url)

 return data
}

async function getUrls(page) {
    const url = await page.url()
 const nextPage =   await page.$('.entity__count span')
 let productCount =0
    const pageUrls = []

if(nextPage){
     productCount = await page.evaluate(() => parseInt(document.querySelector('.entity__count span').innerText.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
      
    }
}


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

