

const initValues ={
    productPageSelector:'.js-list-products',
    linkSelector:'.navigation a',
    linksToRemove:[],
    hostname:'https://www.panco.com.tr/',
    exclude:[],
    postFix:''
  }

async function extractor(page) {


    const url = await page.url()


    const data = await page.$$eval('.product-item-box', (productCards,url) => {
        return productCards.map(productCard => {
try {
    const imageUrl = productCard.querySelector('.product-item-image').src
    const title = productCard.querySelector('.product-name').innerHTML.replace(/\n/g, '').trim()
    const priceNew = productCard.querySelector('.product-sale-price').innerHTML.replace(/\n/g, '').replace("TL",'').trim()
   const link = productCard.querySelector('.product-item-info a').href

   return {
       title: 'panco ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
       timestamp: Date.now(),
       marka: 'panco',
   } 
} catch (error) {
    return {error:error.toString(),url,content:document.innerHTML}
}
          
        })
    },url)
debugger
return data
}

async function getUrls(page) {
    const url = await page.url()
  const nextPage =  await page.$('.js-pagination')
 
    const pageUrls = []

 if(nextPage){
    const totalPages = await page.evaluate(()=>document.querySelectorAll(".js-pagination")[document.querySelectorAll(".js-pagination").length-1])
    
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?page=` + i)
    }
 }
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }


