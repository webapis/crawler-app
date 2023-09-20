

const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

   await autoScroll(page)
    debugger
    const data = await page.$$eval('.product-item-wrapper', (productCards) => {
        return productCards.map(document => {
                try {
                    const title = document.querySelector('.product-name a').innerText
                    const imageUrl= document.querySelector(".product-item-image-link [data-default-img]")?document.querySelector(".product-item-image-link [data-default-img]").getAttribute('data-default-img'):(document.querySelector(".product-item-image-link .product-item-image")?document.querySelector(".product-item-image-link .product-item-image").src: null)
                    const priceNew =document.querySelector('.product-sale-price').innerText.replace('TL','').trim()
                    const link = document.querySelector('.product-name a').href
    
                    return {
                        title: 'kigili '+title.replace(/İ/g,'i').replaceAll('-',' ').toLowerCase(),
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'kigili',
        
                    } 
                } catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
     
        })
    })
debugger
return data




}






async function getUrls(page) {

    const url = await page.url()
   const nextPage = await page.$('.pagination .pagination-item')

    const pageUrls = []
    if(nextPage){
        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll(".pagination .pagination-item")).map(m=>m.innerText.trim()).filter(Number)))

        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
         
        }
    }

  

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.list-content'
const linkSelector='.ddd'
const linksToRemove=[]
const hostname='https://www.kigili.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
