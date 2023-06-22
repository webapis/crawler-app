

async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()

    await page.waitForSelector('.catalogWrapper')


    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.detailLink img').src
            const title = document.querySelector('.productDetails a[title]').getAttribute('title').replace('/', '-')
            const priceNew = document.querySelector('.currentPrice').innerText.replace('TL', '').trim()
            const longlink = document.querySelector('.productDetails a[title]').href
            const link = longlink.substring(longlink.indexOf("https://www.hukkadesign.com") + 27)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://www.hukkadesign.com/") + 28)

            return {
                title: 'hukkadesign ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'hukkadesign',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)
debugger

    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.ttl-pro')
    const productCount = await page.$eval('.ttl-pro', element => parseInt(element.innerText.replace(/[^\d]/g, '')))
    const pageNumber = Math.ceil(productCount / 15)
    const pageUrls = []

    pageUrls.push(`${url}?ps=` + pageNumber)

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }