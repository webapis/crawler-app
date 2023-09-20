

async function extractor(page) {

    const data = await page.$$eval('.product-small', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl =   document.querySelector('img[data-srcset]').getAttribute('data-srcset').split(', ')[0].split(' ')[0]
                const title = document.querySelector('.product-title a').text.trim()
                const priceNew = document.querySelector('.woocommerce-Price-amount.amount bdi').textContent.trim().replace('₺', '')
                const link = document.querySelector('.product-title a').href
              
  
                return {
                    title: 'ikbalderi ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'ikbalderi',
                }  
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
        
        })
    })

return data

   
}

async function getUrls(page) {
    const url = await page.url()
 const nextPage =   await page.$('.woocommerce-result-count.hide-for-medium')
 let productCount = 0

    const pageUrls = []
if(nextPage){
    productCount = await page.evaluate(() => parseInt(document.querySelector('.woocommerce-result-count.hide-for-medium').innerText.split(' ')[0]))
    const totalPages = Math.ceil(productCount / 12)
    for (let i = 2; i <= totalPages; i++) {
        
        pageUrls.push(`${url}/page/` + i + '/')
      
    }
}

  

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.products'
const linkSelector='#woocommerce_product_categories-13 a'
const linksToRemove=[]
const hostname='https://ikbalderi.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

