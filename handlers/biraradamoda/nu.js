
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
  productPageSelector:'#CollectionProductGrid',
  linkSelector:'.main-navigation a',
  linksToRemove:[],
  hostname:'https://www.nu.com.tr/',
  exclude:[],
  postFix:''
}

async function extractor(page) {


    const url = await page.url()

    await autoScroll(page)

    const data = await page.$$eval('article.product-item', (productCards,url) => {
        return productCards.map(document => {
            try {
                const imageUrl = document.querySelector('.product-item-image').getAttribute('data-srcset')? 'https:'+ document.querySelector('.product-item-image').getAttribute('data-srcset').split(',').reverse()[0].trim().split(' ')[0]:null
                const title = document.querySelector('.product--item-title a').innerText
                const priceNew =0// Array.from(document.querySelector('.product-item-price').querySelectorAll('span')).map(m=>m.innerText.replace('₺','').trim()).sort().reverse()[0]
                const link = document.querySelector('.product--item-title a').href
           
                return {
                    title: 'nu ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'nu',
                }  
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
      
        })
    },url)

return data.filter(f=> f.imageUrl !==null)
}




async function getUrls(page) {
    const url = await page.url()
       const nextPageExist = await page.$('.pagination-parts')
       const pageUrls = []
       if(nextPageExist){
        await page.waitForSelector('.pagination-parts')
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination-parts a')).map(m=>m.innerText).filter(Number)))
      
    
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
    
    
        }

       }
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }