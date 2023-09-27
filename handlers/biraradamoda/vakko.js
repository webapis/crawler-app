

const initValues ={
    productPageSelector:'.plp-products',
    linkSelector:'#main-menu a',
    linksToRemove:[],
    hostname:'https://www.vakko.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
  
    debugger;
    const url = await page.url()

    debugger
//await autoScroll(page)
    const data = await page.$$eval('.plp-products .prd', (productCards,url) => {
        return productCards.map(productCard => {
try {
    const prodName = productCard.querySelector('.prd-title').textContent.replace('\n', '').trim()
    const priceNew = productCard.querySelector('.prc.prc-last') ? productCard.querySelector('.prc.prc-last').innerHTML.replace('₺', '').trim() : undefined
    const link = productCard.querySelector('.prd-link').href
    const imageUrl = productCard.querySelector('.prd-link img[data-srcset]').getAttribute('data-srcset')

    const title = prodName
    return {
        title: 'vakko ' + title.replace(/İ/g, 'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'vakko',
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
const nextPage = await page.$('.pz-pagination__list [data-page]')

    const pageUrls = []
if(nextPage){
    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pz-pagination__list [data-page]')).map(m => m.getAttribute('data-page')).filter(Number).map(m => parseInt(m))))

    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
    }
}
  


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
