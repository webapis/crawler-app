

async function extractor(page, ) {


    const data = await page.$$eval('.ItemOrj', (productCards) => {
        return productCards.map(productCard => {
            try {
                const imageUrl = productCard.querySelector(".detailLink img[data-original]") && productCard.querySelector(".detailLink img[data-original]").getAttribute('data-original')
                const title = productCard.querySelector('.detailLink').getAttribute('title')
                const priceNew = productCard.querySelector('.discountPrice') && productCard.querySelector(".discountPrice span").innerHTML.replaceAll('\n','').replace('₺','')
                const longlink = productCard.querySelector('.detailLink').href
                const link = longlink.substring(longlink.indexOf("https://www.deriderim.com/") + 26)
                const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") + 29)
                return {
                    title: 'deriderim ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'deriderim',
                }   
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            
            }
 
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    return data


}

async function getUrls(page) {
    debugger
    const url = await page.url()
 const nextPage =   await page.$('.appliedFilter.FiltrelemeUrunAdet span')
 let productCount =0

    const pageUrls = []
    debugger
    if(nextPage){
         productCount = await page.evaluate(() => parseInt(document.querySelector(".appliedFilter.FiltrelemeUrunAdet span").innerHTML.replace(/[^\d]/g, '')))
     
        const totalPages = Math.ceil(productCount / 200)
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?sayfa=` + i)
         
    
        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='#ProductPageProductList'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.deriderim.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

