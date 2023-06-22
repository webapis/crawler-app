
async function handler(page, context) {
    const { request: { userData: { subcategory, category } } } = context
    debugger;
    const url = await page.url()

    await page.waitForSelector('.isotope-container')
    debugger;

    const data = await page.$$eval('.isotope-container .tmb', (productCards, _subcategory, _category) => {
        return productCards.map(productCard => {
            const title = productCard.querySelector('.t-entry-title.h6 a').innerHTML.trim()
            const priceNew = productCard.querySelector('.woocommerce-Price-amount.amount').textContent.replace('₺', '').trim()
            const longlink = productCard.querySelector('.tmb a').href
              const link = longlink.substring(longlink.indexOf("https://ipekkiramer.com/") + 24)
            const longImgUrl = productCard.querySelector('.tmb img').src
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://ipekkiramer.com/wp-content/uploads/") + 43)
            return {
                title,
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'ipekkiramer',
                subcategory: _subcategory,
                category: _category

            }
        })//.filter(f => f.imageUrl !== null)
    }, subcategory, category)

    console.log('data length_____', data.length, 'url:', url)



    return data
}

async function getUrls(page) {
    debugger;
    const url = await page.url()
    const nextPageExists = await page.$('.pagination li a')
    const pageUrls = []
    if(nextPageExists){
        debugger;
        const totalPages = await page.evaluate(() => parseInt(document.querySelectorAll('.pagination li a')[document.querySelectorAll('.pagination li a').length - 2].innerHTML))

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
    
        }
    }
  
  

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }