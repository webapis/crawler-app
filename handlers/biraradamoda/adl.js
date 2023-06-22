
async function handler(page, context) {
    const { request: { userData: { } } } = context
    debugger;
    const url = await page.url()
    await page.waitForSelector('.products__items')

    const data = await page.$$eval('.products__items .product-item', (productCards) => {
        return productCards.map(productCard => {


            const title = productCard.querySelector('.product-item__name.d-block').innerText.trim()
            const priceNew = productCard.querySelector('.price__new').innerText.replace('TL', '').trim()
            const longlink = productCard.querySelector('.d-block.list-slider-item__link').href
            const link = longlink.substring(longlink.indexOf('https://www.adl.com.tr/') + 23)
            const longImgUrl = productCard.querySelector('.d-block.list-slider-item__link img').src
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://lmb-adl.akinoncdn.com/products/') + 39)
            debugger;
            return {
                title: 'adl ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'adl',

            }
        })//.filter(f => f.imageUrl !== null)
    })
    debugger;
    console.log('data length_____', data.length, 'url:', url)



    const formatprice= data.map((m) => {
        return { ...m,title:m.title+" _"+process.env.GENDER  }
    })


    return formatprice
}

async function getUrls(page) {

  
    const firstUrl = await page.url()
    const nextPageExists = await page.$('.pagination__item')
    const pageUrls = []
    if(nextPageExists){
        const totalPages = await page.evaluate(() => {
            return document.querySelectorAll('.pagination__item')[document.querySelectorAll('.pagination__item').length - 2].innerHTML.replace(/[^\d]/g, "")
        })
    
      
        let pagesLeft = totalPages
    
        for (let i = 2; i <= totalPages; i++) {
            const url = `${firstUrl}?page=${i}`
    
            if (pagesLeft >= 1) {
                pageUrls.push(url)
                --pagesLeft
            }
        }
    }
  


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }