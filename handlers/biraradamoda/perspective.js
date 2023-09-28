
const initValues ={
    productPageSelector:'.ProductList',
    linkSelector:'#MainMenu a',
    linksToRemove:[],
    hostname:'https://www.perspective.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {


    const url = await page.url()
    debugger
    await page.waitForSelector('.ProductList')
    
    const acceptcookies = await page.$('#personaPersonaclickExitClose')
    if (acceptcookies) {
        await page.click('#personaPersonaclickExitClose')
    }

const data = await page.$$eval('.Prd', (productCards,url) => {
        return productCards.map(productCard => {
try {
    const imageUrl = productCard.querySelector('[data-src]') ? productCard.querySelector('[data-src]').getAttribute('data-src') : productCard.querySelector('.PImage').src
    const title = productCard.querySelector('.PImage') ? productCard.querySelector('.PImage').alt : productCard.innerHTML
    const priceNew = productCard.querySelector('.PriceArea').querySelectorAll('span').length === 1 ? productCard.querySelector('.PriceArea').querySelectorAll('span')[0].innerHTML.trim().replace('₺', '').trim() : productCard.querySelector('.PriceArea').querySelectorAll('span')[1].innerHTML.trim().replace('₺', '').trim()
    const link = productCard.querySelector('.carousel-item a').href


   return {
        title: 'perspective ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'perspective',

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

    const pageUrls = []
  const nextpage = await page.$('.DottetArea .Pages [data-pgno]')
    

if(nextpage){
    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.DottetArea .Pages [data-pgno]')).map(m=>m.innerHTML).filter(Number).map(m => parseInt(m))))
  
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?p=` + i)
    }
}
      


    
  

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

