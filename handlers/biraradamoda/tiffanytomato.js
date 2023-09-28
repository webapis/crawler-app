const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.product',
    linkSelector:'.header-menu a',
    linksToRemove:[],
    hostname:'https://www.tiffanytomato.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
 
    debugger;
    const url = await page.url()

    await autoScroll(page)
    debugger;


    const data = await page.$$eval('.product', (productCards,url) => {
        return productCards.map(productCard => {

            try {
                const title = productCard.querySelector(".product-info .name a").innerHTML.replace(/\n/g, '').trim()
                const imageUrl= productCard.querySelector(".product-image").src
                const priceNew =productCard.querySelector(".price").innerHTML.replace('TL', '').replace(/\n/g, '').trim()
                const link = productCard.querySelector(".image a").href
  
              return {
                    title:'tiffanytomato '+title.replace(/İ/g,'i').toLowerCase().replaceAll('-',' '),
                    priceNew,
                    imageUrl ,
                    link,
                    timestamp: Date.now(),
                    marka: 'tiffanytomato',
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
