

async function extractor(page) {

        const data = await page.$$eval('.js-product-miniature-wrapper', (productCards) => {
            return productCards.map(document => {
    
                const imageUrl = document.querySelector('[data-full-size-image-url]').getAttribute('data-full-size-image-url')
                const title = document.querySelector('.product-title').innerText.trim()
                const priceNew = document.querySelector('.product-price').innerText.trim().replace('₺', '')
                const link = document.querySelector('.product-title a').href
        
    
    
                return {
                    title: 'alinderi ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'alinderi',
                }
            }).filter(f => f.imageUrl !== null && f.title.length > 5)
        })
    

return data
   
}
const productPageSelector='#js-product-list'
const linkSelector='#cbp-hrmenu a'
const linksToRemove=[]
const hostname='https://alinderi.com.tr/'
const exclude=[]
const postFix =''

async function getUrls(page) {
    
    const url = await page.url()

    let  pageUrls = []
    const hasNextPage =await page.$('.products-nb-per-page')
    if(hasNextPage){
        const productCount = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.dropdown-menu a')).map(m=>m.innerHTML.trim()).filter(Number)))
        pageUrls.push(`${url}?p?order=product.position.asc&resultsPerPage=` + productCount)

    }
  
    return { pageUrls, productCount:0, pageLength: 0 }

}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }