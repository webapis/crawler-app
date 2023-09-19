

async function extractor(page) {

    const data = await page.$$eval('.product', (productCards) => {
        return productCards.map(document => {
try {
    const imageUrl = document.querySelector('.image img').src
    const title = document.querySelector('.image img').alt.trim()
    const priceNew = document.querySelector('.price').innerText.replace('₺', '').replace('TL', '').replace('$', '')+',00'
    const link = document.querySelector('.image a').href
 

    return {
        title: 'deristore ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'deristore',
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
   const nextPage = await page.$('.pagination a')

if(nextPage){
    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination a')).map(m=>m.innerText).filter(Number)))
    
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
    
    }
}



    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.product-grid .product'
const linkSelector=''
const linksToRemove=[]
const hostname='https://www.deristore.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

