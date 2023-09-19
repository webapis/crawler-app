

const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page,marka) {
    await autoScroll(page);
    const data = await page.$$eval('.Prd', (productCards,marka) => {
        return productCards.map(document => {
            try {
                const priceNew = Array.from(document.querySelector('.SalesAmount').querySelectorAll('.PPrice')).reverse()[0].innerHTML.replace('TL', '').trim()
                const longlink = document.querySelector('a[data-product').href
                const link = longlink.substring(longlink.indexOf("https://www.addax.com.tr/") + 25)
                const longImgUrl = document.querySelector("img[data-src]").getAttribute('data-src')
                const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://cdn3.sorsware.com/") + 26)//https://cdn3.sorsware.com/
                const title = document.querySelector("img[data-src]").alt
                return {
                    title: marka+' ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka,
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
  
        })
        
    },marka)

return data

}


const productPageSelector='.PrdContainer'
//const linkSelector='a:not(.Prd a)'
const linkSelector='#MainMenu a'
const linksToRemove=['https://www.addax.com.tr/alt-giyim/',
'https://www.addax.com.tr/ust-giyim/',
'https://www.addax.com.tr/dis-giyim/',
'https://adidas.my.salesforce.com/'
]
const hostname='https://www.addax.com.tr/'
const productItemsSelector='.Prd'
const exclude=[".pdf"]
const postFix =''

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix }

