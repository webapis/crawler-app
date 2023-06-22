

async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()
    debugger
    await page.waitForSelector('#ProductPageProductList')
    await page.waitForSelector('.ItemOrj')
    debugger

    const data = await page.$$eval('.ItemOrj', (productCards) => {
        return productCards.map(productCard => {

            const imageUrl = productCard.querySelector(".detailLink img[data-original]") && productCard.querySelector(".detailLink img[data-original]").getAttribute('data-original')
            const title = productCard.querySelector('.detailLink').getAttribute('title')
            const priceNew = productCard.querySelector('.discountPrice') && productCard.querySelector(".discountPrice span").innerHTML.replaceAll('\n','').replace('₺','')
            const longlink = productCard.querySelector('.detailLink').href
            const link = longlink.substring(longlink.indexOf("https://www.deriderim.com/") + 26)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") + 29)
            return {
                title: 'deriderim ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'deriderim',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 10)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

    debugger
    console.log("process.env.GENDER ")
    const mapgender = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return mapgender
}

async function getUrls(page) {
    debugger
    const url = await page.url()
    await page.waitForSelector('.appliedFilter.FiltrelemeUrunAdet span')
    const productCount = await page.evaluate(() => parseInt(document.querySelector(".appliedFilter.FiltrelemeUrunAdet span").innerHTML.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 200)
    const pageUrls = []
    debugger
    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?sayfa=` + i)
        --pagesLeft

    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }