
async function extractor(page) {

 
    
        const data = await page.$$eval('.products__item', (productCards) => {
            return productCards.map(document => {
                try {
                    const imageUrl = Array.from(document.querySelectorAll(".product__imageList img")).map(m=>m.getAttribute("data-original"))[0]
                    const title = document.querySelector("a.product__imageWrapper").getAttribute("title").trim()
                    const priceNew = document.querySelector(".product__price.-actual").innerText.replace("TL",'').trim()
                    const link = document.querySelector("a.product__imageWrapper").href
                 
              
                   return {
                        title: 'divarese ' + title,
                       priceNew,
                        imageUrl,
                       link,
                        timestamp: Date.now(),
                        marka: 'divarese',
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
    const nextPage =    await page.$('.js-total-products-count')
    let productCount =0
        const pageUrls = []
        if(nextPage){
             productCount = await page.$eval('.js-total-products-count', element => parseInt(element.innerHTML))
            const totalPages = Math.ceil(productCount / 60)
            for (let i = 2; i <= totalPages; i++) {
                pageUrls.push(`${url}?page=` + i)
            }
        }
    
     
    
        return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
    }
    const productPageSelector='#products'
    const linkSelector='.navbar__content a'
    const linksToRemove=[]
    const hostname='https://www.divarese.com.tr/'
    const exclude=[]
    const postFix =''
    
    module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
    
    