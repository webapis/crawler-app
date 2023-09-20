
async function extractor(page) {



    await page.waitForSelector('.fl.col-12.catalogWrapper')
    debugger
    await page.hover('.countryChange')

    debugger
    await page.waitForSelector('.countryChange')
     await page.hover('.countryChange')

     const valueExits  =   await page.$('[data-value=tr]')
     const valueTLExits  =   await page.$('[data-value=TL]')
     if(valueExits){
        console.log('chaged language')
        await page.click('[data-value=tr]')
        await page.waitForNavigation()
     }
     if(valueTLExits){
        console.log('chaged to TL')
        await page.click('[data-value=TL]')
        await page.waitForNavigation()
     }
  
    debugger
    const products = await page.evaluate(()=>window.PRODUCT_DATA)

    debugger;

   const data = products.map(product => {
   
            const imageUrl =product.image
            const title = product.name
            const priceNew = product.total_sale_price.toString().replace('.',',')
            const link = product.url
  
            return {
                title:'gizia '+title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'gizia',

            }
        })



    return data
}

async function getUrls(page) {
    debugger
    const url = await page.url()
  const nextPage =  await page.$('.productPager')


    const pageUrls = []
if(nextPage){
    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.productPager a[title]')).map(m=>m.getAttribute('title').replace(/[^\d]/g,'')).filter(Number).map(m=>parseInt(m))))
    debugger
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?pg=` + i)
    }
}
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
 
 
   
}
const productPageSelector='.fl.col-12.catalogWrapper'
const linkSelector='nav ul.menu a'
const linksToRemove=[]
const hostname='https://www.gizia.com'
const exclude=['/en/']
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

