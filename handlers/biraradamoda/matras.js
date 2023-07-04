

async function handler(page, context) {


    const url = await page.url()
    debugger
    await page.waitForSelector('#listelenen_urunler')
    debugger
    const data = await page.$$eval('.product_box', (productCards) => {
        return productCards.map(productCard => {

            const imageUrl = productCard.querySelector('.product_image img').src
            const title = productCard.querySelector('.product_name') ? productCard.querySelector('.product_name').textContent.replaceAll('\n','') : null
            const priceNew = productCard.querySelector('.turkcell-price span') ? productCard.querySelector('.turkcell-price span').innerHTML.replaceAll('\n', '').replace('TL', '') : null
            const longlink = productCard.querySelector('.product_image a').href
            const link = longlink.substring(longlink.indexOf("https://www.matras.com/") + 23)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://img.matras.com/") + 23)

            return {
                title: 'matras ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'matras',
            }
        })//.filter(f => f.imageUrl !== null && f.title.length > 3 && f.priceNew != null)
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
    await page.waitForSelector('.page_numbers span')
    // const productCount = await page.$eval('.catalog__meta--product-count span', element => parseInt(element.innerHTML))
    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.page_numbers span')).map(m => m.innerHTML).filter(Number)))
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }