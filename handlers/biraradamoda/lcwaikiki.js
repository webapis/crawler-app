async function extractor(page) {

    await page.waitForSelector('.product-grid .product-card')
    debugger
    const data = await page.evaluate(() => {
        const items = window.catalogModel.CatalogList.Items
        return items.map(item => {
            const { DefaultOptionImageUrl: imageUrl,
                Price: priceNew,
               ModelUrl,
                ProductDescription: title,
            } = item
            return {
                title: 'lcwaikiki '+title.replace(/İ/g,'i').toLowerCase(),
                priceNew: priceNew.replace('TL', '').trim(),
                imageUrl,
                link: 'https://www.lcwaikiki.com/'+ModelUrl.substring(1),
                timestamp: Date.now(),
                marka: 'lcwaikiki',
            }
        })
    })
    debugger;

    return data
}

async function getUrls(page) {
    debugger
    const param = '?PageIndex='
 const nextPage =  await page.$('.product-list-heading__product-count')
debugger;
    const firstUrl = await page.url()
    let productCount =0

    const pageUrls = []
  if(nextPage){
     productCount = await page.$eval('.product-list-heading__product-count p', element => parseInt(element.innerText.replace(/\D/g, '')))
    debugger;
    const totalPages = Math.ceil(productCount / 96)
    for (let i = 2; i <= totalPages; i++) {
        const url = `${firstUrl}${param}${i}`
            pageUrls.push(url)
    }
  
    }
    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.product-grid .product-card'
const linkSelector='.sitemap a'
const linksToRemove=[]
const hostname='https://www.lcwaikiki.com/tr-TR/TR'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
