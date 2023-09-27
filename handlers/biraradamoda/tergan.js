

const initValues ={
    productPageSelector:'.item.itemauto',
    linkSelector:'.navbar-nav a',
    linksToRemove:[],
    hostname:'https://www.tergan.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
 

    const url = await page.url()


    const data = await page.$$eval('.item.itemauto', (productCards,url) => {
        return productCards.map(productCard => {
            try {
                const imageUrl ='https://www.tergan.com.tr'+ productCard.querySelector('.product img') && productCard.querySelector('.product img').getAttribute('src')
                const title = productCard.querySelector(".product .description a").innerHTML.trim()
                const priceNew = productCard.querySelector('.p-value') ? productCard.querySelector('.p-value').textContent.trim().replace('TL', '').trim() : productCard.querySelector('.price-sales').textContent.trim().replace('TL', '').trim()
                const link = productCard.querySelector(".product .description a").href
              
                return {
                    title: 'tergan ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'tergan',
                }  
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
        
        })
    },url)

 return data
}

async function getUrls(page) {
    const url = await page.url()
 const nextPage=   await page.$('.cat-total-count')
 let productCount = 0
    const pageUrls = []
if(nextPage){
     productCount = await page.evaluate(()=>document.querySelector('.cat-total-count').innerText.replace(/[^\d]/g,''))
    const totalPages = Math.ceil(productCount / 96)
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?rpg=` + i)
    }

}
  
   

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
