
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.categoryitem',
    linkSelector:'#navigationbar a',
    linksToRemove:[],
    hostname:'https://www.patirti.com/',
    exclude:[],
    postFix:''
  }
//currentPrice
async function extractor(page, ) {
 
        debugger
await autoScroll(page)
const url = await page.url()
debugger
const data = await page.$$eval('.categoryitem', (productCards,url) => {
    return productCards.map(document => {
try {
const imageUrl ='https://www.patirti.com'+ document.querySelector('.itemimagecontainer img').getAttribute('data-src')
const title = document.querySelector('.categorydetail').innerText
const priceNew = document.querySelector('.pricenew').innerText.replace('₺','')
const link = document.querySelector('.categoryitemlink').href

return {
   title,
    priceNew,
    imageUrl,
    link,
    timestamp: Date.now(),
    marka: 'patırtı',
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


    const pageUrls = []

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }


