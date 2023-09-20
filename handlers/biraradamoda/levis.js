
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

   // await autoScroll(page)

    const data = await page.$$eval('[data-js="p-item"]', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl = document.querySelector('.image img').src
                const title = document.querySelector('.image a').getAttribute('title')
                const priceNew = document.querySelector('.one-price') ? document.querySelector('.one-price').innerText.replace('TL', '').trim() : document.querySelector('.new-price').innerText.replace('TL', '').trim()
                const link = document.querySelector('.image a').href
       
                return {
                    title: 'levis ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'levis',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
       
        })
    })

  return data
}

async function getUrls(page) {
    const url = await page.url()
    const hasNextPage = await page.$('.page-pagination a')
    const pageUrls = []
    if (hasNextPage) {

        const totalPages = await page.evaluate(() => parseInt(Math.max(...Array.from(document.querySelectorAll('.page-pagination a')).map(m => m.innerText).filter(Number))))

        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?p=` + i)
          
        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.product-listing'
const linkSelector='.ddd'
const linksToRemove=[]
const hostname='https://www.levis.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
