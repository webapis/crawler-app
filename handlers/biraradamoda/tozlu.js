
const initValues ={
    productPageSelector:'#ProductPageProductList .ItemOrj.col-4',
    linkSelector:'.navigation a',
    linksToRemove:[],
    hostname:'https://www.tozlu.com/TR/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
 
    const url = await page.url()

    const data = await page.$$eval('.ItemOrj', (productCards,url) => {
        return productCards.map(productCard => {
            try {
                const imageUrl = productCard.querySelector('[data-original]').getAttribute('data-original')
                const title = productCard.querySelector('.productName.detailUrl a').innerHTML.trim()
                const priceNew = productCard.querySelector('.discountPrice span').innerHTML.replace('TL', '').replace(/\n/g, '').trim()
                const link = productCard.querySelector('.productName.detailUrl a').href
          
                return {
                    title: 'tozlu ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'tozlu',
                }   
            } catch (error) {
                return {error:error.toString(),url,url,content:document.innerHTML}
            }

        })
    },url)

return data
}

async function getUrls(page) {
    const url = await page.url()
 const nextPage =   await page.$('.appliedFilter.FiltrelemeUrunAdet span')
 let productCount=0
    const pageUrls = []
if(nextPage){
     productCount = await page.$eval('.appliedFilter.FiltrelemeUrunAdet span', element => parseInt(element.innerHTML.replace(/[^\d]/g, "")))
    const totalPages = Math.ceil(productCount / 50)
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?sayfa=` + i)
    }
}
   


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
