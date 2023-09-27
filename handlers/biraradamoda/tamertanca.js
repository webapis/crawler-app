
const initValues ={
    productPageSelector:'.js-list-products',
    linkSelector:'.page-header a',
    linksToRemove:[],
    hostname:'https://www.tamertanca.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    debugger
        const url = await page.url()
    
     
        const data = await page.$$eval('.product-item', (productCards,url) => {
            return productCards.map(document => {
    try {
        const imageUrl = document.querySelector(".slider-item img").getAttribute('data-src')
        const title = document.querySelector(".slider-item img").alt
        const priceNew =document.querySelector(".product-info__offer-price")? document.querySelector(".product-info__offer-price").innerText.replace("TL",'').trim(): document.querySelector(".product-info__current-price").innerText.replace("TL",'').trim()
        const link = document.querySelector(".product-item a").href
  
   
       return {
           title: 'tamertanca ' + title.replace(/İ/g,'i').toLowerCase(),
           priceNew,
           imageUrl,
           link,
           timestamp: Date.now(),
           marka: 'tamertanca',
       }
    } catch (error) {
        return {error:error.toString(),content:document.innerHTML}
    }
            
            })
        },url)
return data
    }
    
    async function getUrls(page) {
        const url = await page.url()
    const nextPage=    await page.$('.size')

        const pageUrls = []
        let productCount = 0 
if(nextPage){
     productCount = await page.$eval('.size', element => parseInt(element.innerText.replace(/[^\d]/gi,'')))
    const totalPages = Math.ceil(productCount / 24)
    for (let i = 2; i <= totalPages; i++) {
    
        pageUrls.push(`${url}?page=` + i)

    }
}

    
        return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
    }
    module.exports = { extractor, getUrls,...initValues }
