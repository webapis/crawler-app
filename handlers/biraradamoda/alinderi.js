

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('#js-product-list')


    const data = await page.$$eval('.js-product-miniature-wrapper', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('[data-full-size-image-url]').getAttribute('data-full-size-image-url')
            const title = document.querySelector('.product-title').innerText.trim()
            const priceNew = document.querySelector('.product-price').innerText.trim().replace('₺', '')
            const longlink = document.querySelector('.product-title a').href
            const link = longlink.substring(longlink.indexOf("https://www.alinderi.com.tr/") + 28)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://www.alinderi.com.tr/") + 28)

            return {
                title: 'alinderi ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'alinderi',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)


    console.log("process.env.GENDER ")

    const mapgender = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })
    debugger
    return mapgender
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.products-nb-per-page')
    const productCount = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.dropdown-menu a')).map(m=>m.innerHTML.trim()).filter(Number)))

    const pageUrls = []

debugger
    pageUrls.push(`${url}?p?order=product.position.asc&resultsPerPage=` + productCount)





    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }