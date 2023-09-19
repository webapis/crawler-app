

async function extractor(page) {

    const data = await page.$$eval('.list-content-product-item', (productCards) => {
        return productCards.map(productCard => {
                try {
                    const imageUrl = productCard.querySelector('.img1').getAttribute('src')
                    const title = productCard.querySelector('.product-name').innerHTML.trim()
                    const priceNew = productCard.querySelector('.product-sale-price-list')? productCard.querySelector('.product-sale-price-list').textContent.trim().replace('TL', ''): productCard.querySelector('.product-sale-price').textContent.trim().replace('TL', '')
                    const link = productCard.querySelector('.img-holder a').href
     
                    return {
                        title: 'derimod ' + title.replace(/İ/g,'i').toLowerCase(),
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'derimod',
                    } 
                } catch (error) {
                    return{
                        error:error.toString(),content:document.innerHTML
                    }
                }
       
        })
    })




    return data
}

async function getUrls(page) {
    const url = await page.url()

    const pageUrls = []
 const nextPage =   await page.$('.search-total-count')
    if(nextPage){
        const totalPages = await page.evaluate(()=> Math.max(...Array.from(document.querySelectorAll('.pagination-item')).map(m=>m.innerHTML.replace(/[^\d]/g, '')).filter(Number))) 
      
    
     
        for (let i = 2; i <= totalPages; i++) {
    
            pageUrls.push(`${url}?page=` + i)
    
    
        }
    }
   

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.list-content-product-item'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.derimod.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

