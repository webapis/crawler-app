const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'#ProductListMainContainer',
    linkSelector:'.navigation a',
    linksToRemove:[],
    hostname:'https://www.slatra.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page, ) {

    debugger;
    const url = await page.url()
  
  
     await autoScroll(page)
    debugger;


    const data = await page.$$eval('.ItemOrj', (productCards,url) => {
        try {
            return productCards.map(document => {
                const title = document.querySelector(".productName.detailUrl a").innerHTML
                const imageUrl =document.querySelector("a .productSliderImage")&& document.querySelector("a .productSliderImage").src
                const priceNew = document.querySelector(".discountPrice span").innerText.replace('₺', '')
                const link = document.querySelector(".productName.detailUrl a").href
    
                return {
                    title: 'slatra ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew: priceNew,
                    imageUrl, 
                    link,
                    timestamp: Date.now(),
                    marka: 'slatra',
    
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

    const hasPanination = await page.$('.totalItems')
    const pageUrls = []

    if (hasPanination) {
        const productCount = await page.evaluate(() => parseInt(document.querySelector('.totalItems').innerText))
        const totalPages = Math.ceil(productCount / 50)


        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?sayfa=` + i)
          


        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
