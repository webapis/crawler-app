
const initValues ={
    productPageSelector:'.product-detail-card',
    linkSelector:'#main-menu a',
    linksToRemove:[],
    hostname:'https://www.roman.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    debugger;
    const url = await page.url()

  
    const data = await page.$$eval('.product-item', (productCards,url) => {
        return productCards.map(document => {
try {
    const title = document.querySelector('a.product-title') && document.querySelector('a.product-title').innerText
    const priceNew = document.querySelector('.product-price').innerText.replace('₺', '').trim()
    const link = document.querySelector('a.product-title').href
    const imageUrl = Array.from(document.querySelector("a.image-wrapper picture").querySelectorAll("source")).reverse()[0].getAttribute("data-srcset")

    
    return {
        title: 'roman ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-', ' '),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'roman',
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

 const nextPage=   await page.$('.pagination a')

    const pageUrls = []

  if(nextPage){
    const totalPages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerText).filter(Number).map(m => parseInt(m)).sort().reverse()[0]
    })


    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?pg=` + i)
     
    }
  }
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
