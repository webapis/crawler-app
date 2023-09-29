

async function extractor(page) {


    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.detailUrl [data-original]').getAttribute('data-original')
            const title = document.querySelector('.detailUrl a[title]').getAttribute('title').trim()
            const priceNew = document.querySelector('.discountPrice span').innerText.replace('₺', '')
            const link = document.querySelector('.detailUrl a[title]').href
    
            return {
                title: 'dericeket ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'dericeket',
            }
        })
    })



debugger
    return data
}


const productPageSelector='#ProductPageProductList'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.dericeket.com.tr/'
const exclude=[]
const postFix =''

async function getUrls(page) {
    const url = await page.url()
   const nextPage = await page.$('.FiltrelemeUrunAdet span')
   let productCount=0
    const pageUrls = []
    if(nextPage){
         productCount = await page.$eval('.FiltrelemeUrunAdet span', element => parseInt(element.innerText.replace(/[^\d]/g, '')))
 
        const totalPages = Math.ceil(productCount / 20)
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft
    
    
        }
    }
   

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

