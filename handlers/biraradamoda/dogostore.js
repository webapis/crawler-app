
async function extractor(page) {
  

    const products = await page.evaluate(()=>window.PRODUCT_DATA)


   const data = products.map(product => {
        debugger;
            const imageUrl =product.image
            const title = product.name
            const priceNew = product.total_sale_price
            const link = product.url
        debugger;
            return {
                title:'dogo '+title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'dogo',

            }
        })


    debugger;

    return data
}

async function getUrls(page) {

    const url = await page.url()
  const nextPage =  await page.$('.productPager')


    const pageUrls = []
if(nextPage){
    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.productPager a')).map(m=>m.innerText).filter(Number)))
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?pg=` + i)

    }
}
  

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.catalogWrapper.productListBox'
const linkSelector='nav ul.menu a'
const linksToRemove=[]
const hostname='https://www.dogostore.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

