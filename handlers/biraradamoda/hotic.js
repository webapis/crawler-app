
async function handler(page, context) {

    debugger
    const url = await page.url()

    await page.waitForSelector('.item-grid')
    debugger

    const data = await page.$$eval('.product.product--zoom.product-box', (productCards) => {
        return productCards.map(document => {
            const obj = document.innerHTML
             const imageUrl =document.querySelector('[data-original]').getAttribute('data-original')
            const title = document.querySelector('.product__inside__name a').innerText
             const priceNew = document.querySelector('.product-price-general').innerText.replace('TL','').trim()
               const longlink = document.querySelector('.product__inside__name a').href
             const link = longlink.substring(longlink.indexOf("https://www.hotic.com.tr/")+25)
  
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://img2-hotic.mncdn.com/") + 29)

            return {
                title, //'hotiç ' + title.replace(/İ/g, 'i').toLowerCase(),
                 priceNew,
             imageUrl: imageUrlshort,
                  link,
                timestamp: Date.now(),
                marka: 'hotiç',
            }
        })//.filter(f => f.imageUrl !== null && f.title.length > 5)
    })
    debugger
    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    const pageUrls = []
    const nextPageExists = await page.$('.pagination')
    if (nextPageExists) {
        const totalPages = await page.evaluate(() => Math.max(Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerHTML).filter(Number)))


        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?pagenumber=` + i)
            --pagesLeft


        }
    }



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }