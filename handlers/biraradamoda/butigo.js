
async function handler(page,context) {
    const { request: { userData: {  } } } = context

    const url = await page.url()

    await page.waitForSelector('.row.product-lists')


    const data = await page.$$eval('[data-gtm-product]', (productCards, _subcategory, _category,_node) => {
        return productCards.map(productCard => {

            const obj = JSON.parse(productCard.getAttribute('data-gtm-product'))

            const img = productCard.querySelector('[data-src]').getAttribute('data-src')
            const title = obj.name
            const priceNew =obj.price
            const link = obj.url
            return {
                title: 'butigo '+title.replace(/İ/g,'i').toLowerCase(),
   
                priceNew,

                imageUrl: img.substring(img.indexOf('https://floimages.mncdn.com/mnpadding/')+38),
                link,

                timestamp: Date.now(),
 
                marka: 'butigo',



            }
        })//.filter(f => f.imageUrl !== null)
    })

    console.log('data length_____', data.length, 'url:', url)



    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.listing__total-count span')
    const productCount = await page.$eval('.listing__total-count span', element => parseInt(element.innerHTML))
    const totalPages = Math.ceil(productCount / 72)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {

     

        pageUrls.push(`${url}?page=` + i)
        --pagesLeft
    

    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }