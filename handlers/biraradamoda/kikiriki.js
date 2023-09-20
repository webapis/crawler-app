
async function extractor(page) {

    const data = await page.$$eval('.product-list-item', (productCards) => {
        return productCards.map(document => {
            try {
                const title = document.querySelector('.product-title a[title]').getAttribute('title').trim()
                const priceNew = document.querySelector('.product-price span').textContent.replace('TL', '').trim()
                const link = document.querySelector('.product-image a').href
                const imageUrl =  document.querySelector('amp-img').getAttribute('src')
          
              return {
                    title: 'kikiriki ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'kikiriki',
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
  const nextPage =  await page.$('.flex-fill.m-auto.font-m')
  const pageUrls = []
  let productCount =0
  if(nextPage){
     productCount = await page.$eval('.flex-fill.m-auto.font-m', element => parseInt(element.textContent.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
 
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)

    }

  }
    

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.i-amphtml-fill-content'
const linkSelector='.main-menu a'
const linksToRemove=[]
const hostname='https://tr.kikiriki.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
