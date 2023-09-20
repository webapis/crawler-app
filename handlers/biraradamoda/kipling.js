
async function extractor(page) {



    debugger

    const data = await page.$$eval('.product.product--zoom', (productCards) => {
        return productCards.map(document => {
            try {
                 const imageUrl =document.querySelector('[data-original]').getAttribute('data-original')
                 const title = document.querySelector(".product-box-detail-image-link").getAttribute('title')
                 const priceNew =Array.from(document.querySelectorAll('.product-prices li')).reverse()[0].innerText.replace('TL','').trim()
                 const link = document.querySelector('.product__inside__name a').href
           
                return {
                    title:'kipling ' + title,
                     priceNew,
                 imageUrl: imageUrl,
                      link,
                    timestamp: Date.now(),
                    marka: 'kipling',
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

    const nextPageExist =await page.$(".pagination a")
    const pageUrls = []
    if(nextPageExist){
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination a')).map(m=>m.innerHTML).filter(Number)))

        for (let i = 2; i <= totalPages; i++) {
    
            pageUrls.push(`${url}?pagenumber=` + i)
        
        }
    }


    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.item-grid'
const linkSelector='ul.new-main-menu a'
const linksToRemove=[]
const hostname='https://www.kipling.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
