

const initValues ={
    productPageSelector:'.catalogWrapper',
    linkSelector:'#mainMenu a',
    linksToRemove:[],
    hostname:'https://www.tommylife.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {


    const url = await page.url()

   // await page.waitForSelector('.catalogWrapper')
   // await page.waitForSelector('span b')


  //  await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards,url) => {
        return productCards.map(document => {
            try {
                const imageUrl = document.querySelector('span[itemprop="image"]').getAttribute('content')
                const title = document.querySelector('.productItem a[title]').innerText
                const priceNew = document.querySelector('.currentPrice')? document.querySelector('.currentPrice').innerHTML.replace('TL', '').trim():null
                const link = document.querySelector('.productItem a[title]').href
       
        
                return {
                    title: 'tommylife ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'tommylife',
                }
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
      
        })
    },url)

return data
}





async function getUrls(page) {
  const url = await page.url()
  const nextPage=    await page.$('span b')
 
      const pageUrls = []
    if(nextPage){
        const productCount = await page.$eval('span b', element => parseInt(element.innerText))
    const totalPages =  Math.round(productCount/4)
        pageUrls.push(`${url}?ps=` + totalPages)
    }
 


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
