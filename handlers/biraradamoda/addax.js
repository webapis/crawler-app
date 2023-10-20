

const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {
    await autoScroll(page);
    const data = await page.$$eval('.Prd', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = Array.from(document.querySelector('.SalesAmount').querySelectorAll('.PPrice')).reverse()[0].innerHTML.replace('TL', '').trim()
                const link = document.querySelector('a[data-product').href
              
                const imageUrl = document.querySelector(".PImage").src

                const title = document.querySelector(".PImage").alt
                return {
                    title: 'addax ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka:'addax',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
  
        })
        
    })

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

