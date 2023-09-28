
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
  productPageSelector:'.catalogWrapper',
  linkSelector:'#mainMenu a',
  linksToRemove:[],
  hostname:'https://sarar.com/',
  exclude:[],
  postFix:''
}
async function extractor(page) {

        const url = await page.url()
        await autoScroll(page)
          const data = await page.$$eval('.productItem', (productCards,url) => {
            return productCards.map(document => {
              try {
                   const imageUrl = document.querySelector('span[itemprop="image"]').getAttribute('content')
                   const title = document.querySelector('span[itemprop="name"]').getAttribute('content')
                   const priceNew = document.querySelector('.discount-in-basket-price span')? document.querySelector('.discount-in-basket-price span').innerText.replace('₺',''):document.querySelector('.currentPrice').innerText.replace('₺','').trim()
                   const link ="https://sarar.com/"+ document.querySelector('span[itemprop="url"]').getAttribute('content')

                  return {
                       title: 'sarar ' + title.replace(/İ/g,'i').toLowerCase(),
                       priceNew,
                       imageUrl,
                       link,
                       timestamp: Date.now(),
                       marka: 'sarar',
                  }
              } catch (error) {
                
                return {error:error.toString(),url,content:document.innerHTML}
              }
             
            })
        },url)
 
        return data
      

   
    }

    async function getUrls(page) {
        // const url = await page.url()
        // await page.waitForSelector('.catalog__meta--product-count span')
        // const productCount = await page.$eval('.catalog__meta--product-count span', element => parseInt(element.innerHTML))
        // const totalPages = Math.ceil(productCount / 60)
        const pageUrls = []
    
        // let pagesLeft = totalPages
        // for (let i = 2; i <= totalPages; i++) {
    
    
    
        //     pageUrls.push(`${url}?page=` + i)
        //     --pagesLeft
    
    
        // }
    
        return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
    }
    module.exports = { extractor, getUrls,...initValues }
