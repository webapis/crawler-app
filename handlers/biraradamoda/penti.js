//const {linkExtractor}=require('../../utils/linkExtractor')
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.products',
    linkSelector:'.sub a',
    linksToRemove:[],
    hostname:'https://www.penti.com/tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
    
    const url = await page.url()

    // const menuBtn = await page.$('.btn-menu')

    // if(menuBtn){
    //     debugger
    //     await page.click('.btn-menu')
    //     debugger
    //     await page.waitForTimeout(1000)
    //     debugger
    //     await linkExtractor({...initValues,linkSelector:'.mmn-lv2.sub a',candidateSelector:'.mmn-lv1.sub',page,context,action:'hover'})
  
    // }
debugger
 await autoScroll(page)
debugger
    const data = await page.$$eval('[data-page]', (productCards,url) => {
        return productCards.map(productCard => {
            try {
                const obj = JSON.parse(productCard.querySelector('.prd-link').getAttribute('data-gtm-product'))
                const link = productCard.querySelector('.prd-link').href.trim()
                const imageUrl = obj.dimension19
                return {
                    title: 'penti ' + obj.name.replace(/İ/g, 'i').toLowerCase(),
                    priceNew: obj.price,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'penti',
                }
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
        })
    },url)

    return data
}

async function getUrls(page) {
    
//     const url = await page.url()

//   const nextPage =  await page.$('.plp-info')
//   let productCount =0
    const pageUrls = []

// if(nextPage){
//      productCount = await page.evaluate(() => parseInt(document.querySelector('.plp-info span').textContent.replace(/[^\d]/g, '')))
//     debugger;
//     const totalPages = Math.ceil(productCount / 20)
//     for (let i = 0; i <= totalPages; i++) {
//         pageUrls.push(`${url}?page=` + i)
      
//     }
// }
    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}




module.exports = { extractor, getUrls,...initValues }

