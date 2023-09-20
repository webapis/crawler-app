
//const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

   // await autoScroll(page)
    const data = await page.$$eval('.card-product', (productCards) => {
        return productCards.map(document => {
            try {
              
            const imageUrl = document.querySelector('img[onmouseover]').getAttribute('onmouseover').replace('this.src=','')
            const title = document.querySelector('.card-product-inner .title').innerText.trim()
            const priceNew = document.querySelector('.sale-price').innerText.replace('TL', '').trim()
            const link = document.querySelector('a.c-p-i-link').href
         
            return {
                title: 'lacht ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'lacht',
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
    const nextPageExist = await page.$('.pagination .page-link')
    const pageUrls = []
    if (nextPageExist) {

        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pagination .page-link')).map(m => m.innerText).filter(Number)))

        for (let i = 2; i <= totalPages; i++) {

            pageUrls.push(`${url}?sayfa=` + i)
           
        }

    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.pattern-group-body'
const linkSelector='section.menu a'
const linksToRemove=[]
const hostname='https://www.lacht.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
