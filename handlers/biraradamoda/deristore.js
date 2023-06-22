

async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()

    await page.waitForSelector('.product-grid .product')


    const data = await page.$$eval('.product', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.image img').src
            const title = document.querySelector('.image img').alt.trim()
            const priceNew = document.querySelector('.price').innerText.replace('₺', '').replace('TL', '').replace('$', '')+',00'
            const longlink = document.querySelector('.image a').href
            const link = longlink.substring(longlink.indexOf('https://www.deristore.com.tr/') + 29)
     
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf('https://www.deristore.com.tr/') + 29)

            return {
                title: 'deristore ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'deristore',
            }
        }).filter(f => f.imageUrl && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)

    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })

debugger
    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.pagination a')
    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination a')).map(m=>m.innerText).filter(Number)))
    
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }