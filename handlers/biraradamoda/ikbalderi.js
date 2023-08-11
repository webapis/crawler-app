

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.products')


    const data = await page.$$eval('.product-small', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl =   document.querySelector('img[data-srcset]').getAttribute('data-srcset').split(', ')[0].split(' ')[0]
                const title = document.querySelector('.product-title a').text.trim()
                const priceNew = document.querySelector('.woocommerce-Price-amount.amount bdi').textContent.trim().replace('₺', '')
                const longlink = document.querySelector('.product-title a').href
                const link = longlink.substring(longlink.indexOf("https://ikbalderi.com/") + 22)
                const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://ikbalderi.com/") + 22)
                return {
                    title: 'ikbalderi ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'ikbalderi',
                }  
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
        
        })//.filter(f => f.imageUrl !== null && f.title.length > 10)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

    debugger
    console.log("process.env.GENDER ")
    const mapgender = data.map((m) => {
        return { ...m,  title: m.title + " _" + process.env.GENDER }
    })

    return mapgender
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.woocommerce-result-count.hide-for-medium')
    const productCount = await page.evaluate(() => parseInt(document.querySelector('.woocommerce-result-count.hide-for-medium').innerText.split(' ')[0]))
    const totalPages = Math.ceil(productCount / 12)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}/page/` + i + '/')
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }