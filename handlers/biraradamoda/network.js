

const initValues ={
    productPageSelector:'#products',
    linkSelector:'.navbar a',
    linksToRemove:[],
    hostname:'https://www.network.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    const url = await page.url()

    const data = await page.$$eval('.products__item', (productCards,url) => {

        try {
            return productCards.map(document => {
                const imageUrl = document.querySelector('[data-original]').getAttribute('data-original')
                const title = document.querySelector('a[title]').getAttribute('title')
                const priceNew = document.querySelector(".product__price.-actual").textContent.replace('TL', '').replace(/\n/g, '').trim()
                const link = document.querySelector('a[title]').href
               
                return {
                    title: 'network ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-',' '),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'network',
                }
            })  
        } catch (error) {
            return {error:error.toString(),url,content:document.innerHTML}
        }
    
    },url)
    
return data

}

async function getUrls(page) {
    
    const url = await page.url()
 const nextPage =   await page.$('.js-total-products-count')
  //  await page.waitForSelector('.js-per-page-products-count')


    const pageUrls = []
    if(nextPage){
        const productCount = await page.evaluate(() => {
            return parseInt(document.querySelector('.js-total-products-count').innerText)
        })
        const productPerPage = await page.evaluate(() => {
            return parseInt(document.querySelector('.js-per-page-products-count').innerText)
        })
        
        const totalPages = Math.ceil(productCount / productPerPage)
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
     
        }
    }

  
   
    


    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }