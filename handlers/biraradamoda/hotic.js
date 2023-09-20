
async function extractor(page) {


    await page.waitForSelector('.item-grid')
    debugger

    const data = await page.$$eval('.product.product--zoom.product-box', (productCards) => {
        return productCards.map(document => {
  
             const imageUrl =document.querySelector('[data-original]').getAttribute('data-original')
            const title = document.querySelector('.product__inside__name a').innerText
             const priceNew = document.querySelector('.product-price-general').innerText.replace('TL','').trim()
               const link = document.querySelector('.product__inside__name a').href
    
            return {
                 title:'hotic ' + title,
                 priceNew,
                 imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'hotic',
            }
        })
    })
    debugger



    return data
}

async function getUrls(page) {
    const url = await page.url()
    const pageUrls = []
    const nextPageExists = await page.$('.pagination')
    if (nextPageExists) {
        const totalPages = await page.evaluate(() => Math.max(Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerHTML).filter(Number)))


        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?pagenumber=` + i)
            --pagesLeft


        }
    }



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.item-grid'
const linkSelector='nav.navbar a'
const linksToRemove=[]
const hostname='https://www.hotic.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

