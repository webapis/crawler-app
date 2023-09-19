

async function extractor(page) {



    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.detailLink [data-original]').getAttribute('data-original')
            const title = document.querySelector('a.detailLink[title]').getAttribute('title').trim()
            const priceNew = document.querySelector('.discountPrice').innerText.replace('₺','')
            const link = document.querySelector('.productName.detailUrl a').href
     
            return {
                title: 'blacknoble ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'blacknoble',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    return data
}

const productPageSelector='#ProductPageProductList'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.blacknoble.com/'
const exclude=[]
const postFix ='?currency=try'

async function getUrls(page) {
    const url = await page.url()
    const pageUrls = []
    let productCount = 0
const nextPage =    await page.$('.appliedFilter.FiltrelemeUrunAdet span')

    if(nextPage){
        productCount = await page.$eval('.appliedFilter.FiltrelemeUrunAdet span', element => parseInt(element.innerText.replace(/[^\d]/g,'')))
        const totalPages = Math.ceil(productCount / 30)
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft
    
    
        }
    }
 

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
