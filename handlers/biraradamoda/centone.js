
const {autoScroll}=require('../../utils/autoscroll')


async function extractor(page) {
  
    await autoScroll(page)
    const data = await page.$$eval('.product-item', (productCards) => {
        return productCards.map(document => {
            const imageUrl = document.querySelector('.image-link img').src
            const title = document.querySelector('.image-link img').alt
            const priceNew = document.querySelector('.last-price').innerText
            const link = document.querySelector('.image-link').href
   
     
            return {
                title: 'centone ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'centone',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })


    return data
}
const productPageSelector='.product-list'
const linkSelector='.top-nav a'
const linksToRemove=[]
const hostname='https://www.centone.com.tr/'
const exclude=[]
const postFix =''
async function getUrls(page) {
    const url = await page.url()
    const hasMorePges = await page.$('.pagination a')
    const pageUrls = []
    if (hasMorePges) {
        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerText).filter(Number)))

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {

            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft

        }
    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

