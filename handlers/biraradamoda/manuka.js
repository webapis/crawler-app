
async function handler(page, context) {
    const { request: { userData: {} } } = context


    const url = await page.url()

    await page.waitForSelector('span.forDesktop')
    let elem = await page.$('span.forDesktop')
    await elem.hover()
    await page.click('li span[value="tr"]')
    await page.waitForNavigation()
    await page.waitForSelector('img[alt="Türkçe"]')
    // const language =await page.evaluate(()=>document.querySelector('span.forDesktop').innerHTML)
    // if(language==='English - EUR'){
    //      let elem = await page.$('span.forDesktop')
    //      await elem.hover()
    //      await page.click('span[value="tr"]')
    //     
    // }

    debugger
    await page.waitForSelector('.fl.col-12.catalogWrapper')
    const products = await page.evaluate(() => window.PRODUCT_DATA)
    debugger
    debugger;

    const data = products.map(product => {

        const longImage = product.image
        const title = product.name.replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase()
        const priceNew = product.total_sale_price//.toString()
        const link = product.url

        return {
            title: 'manuka ' + title.replace(/İ/g,'i').toLowerCase().split(' ').map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' ')+" _"+process.env.GENDER,
            priceNew,
            imageUrl: longImage.substring(longImage.indexOf('https://www.manuka.com.tr') + 25),
            link,
            timestamp: Date.now(),
            marka: 'manuka',

        }
    })


    console.log('data length_____', data.length, 'url:', url)




    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {
    debugger
    const url = await page.url()
    await page.waitForSelector('.totalProduct')

    const productCount = await page.$eval('.totalProduct', element => parseInt(element.innerHTML.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 12)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?pg=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }