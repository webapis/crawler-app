

async function handler(page, context) {
 

    const url = await page.url()

    await page.waitForSelector('#ProductPageProductList .ItemOrj.col-4')


    const data = await page.$$eval('#ProductPageProductList .ItemOrj.col-4', (productCards) => {
        return productCards.map(productCard => {

            const imageUrl = productCard.querySelector('[data-original]').getAttribute('data-original')
            const title = productCard.querySelector('.productName.detailUrl a').innerHTML.trim()
            const priceNew = productCard.querySelector('.discountPrice span').innerHTML.replace('TL', '').replace(/\n/g, '').trim()
            const longlink = productCard.querySelector('.productName.detailUrl a').href
            const link = longlink.substring(longlink.indexOf("https://www.tozlu.com/") + 22)
            const imageUrlshort = imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") + 29)

            return {
                title: 'tozlu ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'tozlu',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 10)
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
    await page.waitForSelector('.appliedFilter.FiltrelemeUrunAdet span')
    const productCount = await page.$eval('.appliedFilter.FiltrelemeUrunAdet span', element => parseInt(element.innerHTML.replace(/[^\d]/g, "")))
    const totalPages = Math.ceil(productCount / 50)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?sayfa=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }