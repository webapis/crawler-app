

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('#ProductPageProductList')


    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.detailLink [data-original]').getAttribute('data-original')
            const title = document.querySelector('a.detailLink[title]').getAttribute('title').trim()
            const priceNew = document.querySelector('.discountPrice').innerText.replace('₺','')
            const longlink = document.querySelector('.productName.detailUrl a').href
            const link = longlink.substring(longlink.indexOf("https://www.blacknoble.com/") + 27)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") + 29)

            return {
                title: 'blacknoble ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'blacknoble',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)


    console.log("process.env.GENDER ")
    const mapgender = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return mapgender
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.appliedFilter.FiltrelemeUrunAdet span')
    const productCount = await page.$eval('.appliedFilter.FiltrelemeUrunAdet span', element => parseInt(element.innerText.replace(/[^\d]/g,'')))
    const totalPages = Math.ceil(productCount / 30)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?sayfa=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }