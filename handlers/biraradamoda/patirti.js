
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'#Katalog',
    linkSelector:'#mainMenu a',
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
const data = await page.$$eval('.productItem', (productCards,url) => {
    return productCards.map(document => {
try {
const imageUrl = document.querySelector('img').src
const title = document.querySelector('.productItemInfo').innerText
const priceNew = document.querySelector('.currentPrice').innerText.replace('₺','').trim()
const link = document.querySelector('.productItem a').href

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


