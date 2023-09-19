
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page, ) {


    const url = await page.url()

    await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('a.detailLink img').src
            const title = document.querySelector('a.detailLink img').alt
            const priceNew = document.querySelector('.discountPrice span').innerText.replace('₺', '')
            const longlink = document.querySelector('a.detailLink').href
            const link = longlink.substring(longlink.indexOf('https://www.avva.com.tr/') + 24)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") +29)

            return {
                title: 'avva ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'avva',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })



    return data
}


const productPageSelector='#ProductPageProductList'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.avva.com.tr/'
const exclude=[]
const postFix =''
async function getUrls(page) {
    const url = await page.url()

const nextPage =    await page.$('.pageBorder')
const pageUrls = []
if(nextPage){
    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pageBorder a')).map(m => m.innerText).filter(Number)))
   
    if (totalPages > 1) {
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {

            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft


        }
    }
}
   


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }