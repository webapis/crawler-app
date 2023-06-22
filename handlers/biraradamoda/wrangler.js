

async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()

    await page.waitForSelector('.cl-product-grid')


    const data = await page.$$eval('.cl-product-box-container', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.cl-product-images img[data-src]').getAttribute('data-src')
            const title = document.querySelector('.cl-product-images').getAttribute('title')
            const priceNew = document.querySelector('.cl-product-price').innerText.replace('TL','').trim()
            const longlink = document.querySelector('.cl-product-images').href
            const link = longlink.substring(longlink.indexOf("https://wrangler.com.tr/") + 24)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://f-lwr-l.mncdn.com/") + 26)

            return {
                title: 'wrangler ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'wrangler',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)

debugger
    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.cl-product-grid-length')
    const productCount = await page.evaluate(()=>parseInt(document.querySelector(".cl-product-grid-length").innerText.replace(/[^\d]/g,'')))
    const totalPages = Math.ceil(productCount / 48)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?pagenumber=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }