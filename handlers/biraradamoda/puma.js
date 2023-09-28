
const initValues ={
    productPageSelector:'.products-grid',
    linkSelector:'.sitemap a',
    linksToRemove:[],
    hostname:'https://tr.puma.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

debugger
    const url = await page.url()


    const data = await page.$$eval('.product-item', (productCards,url) => {
        return productCards.map(document => {
            try {
                const imageUrl =document.querySelector('.product-item__media a img').getAttribute('data-src')
                const title = document.querySelector('.product-item__media a img').alt
                const priceNew = document.querySelector('.price').innerText.replace("₺",'').trim()
                const link = document.querySelector('.product-item__media a').href

       
               return {
                    title: 'puma ' + title,
                    priceNew,
                   imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'puma',
               }
            } catch (error) {
                return {error:error.toString(),content:document.content}
            }
      
        })
    },url)
debugger
return data
}

async function getUrls(page) {
    const url = await page.url()
const nextPage =    await page.$('.page-products-count')
let productCount=0
    const pageUrls = []

  if(nextPage){
     productCount = await page.$eval('.page-products-count', element => parseInt(element.innerHTML.replace(/[^\d]/ig,'')))
    const totalPages = Math.ceil(productCount / 36)
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?p=` + i)
  
    }
  }


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

