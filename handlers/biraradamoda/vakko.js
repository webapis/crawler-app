

async function handler(page, context) {
  
    debugger;
    const url = await page.url()

    await page.waitForSelector('.plp-products')
    debugger

    const data = await page.$$eval('.plp-products .prd', (productCards) => {
        return productCards.map(productCard => {

            const prodName = productCard.querySelector('.prd-title').textContent.replace('\n', '').trim()
            const priceNew = productCard.querySelector('.prc.prc-last') ? productCard.querySelector('.prc.prc-last').innerHTML.replace('₺', '').trim() : undefined
            const longlink = productCard.querySelector('.prd-link').href
            const link = longlink.substring(longlink.indexOf("https://www.vakko.com/") + 22)
            const longImgUrl = productCard.querySelector('.prd-link img[data-srcset]').getAttribute('data-srcset')
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://vakko.akinoncdn.com/products/") + 37)
            const title = prodName
            return {
                title: 'vakko ' + title.replace(/İ/g, 'i').toLowerCase(),

                priceNew,//:priceNew.replace('.','').replace(',','.').trim(),

                imageUrl: imageUrlshort,
                link,

                timestamp: Date.now(),

                marka: 'vakko',



            }
        })
    })


    console.log('data length_____', data.length, 'url:', url)
    debugger

    return data.filter(f => f.priceNew !== undefined).map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })

    
}

async function getUrls(page) {
    const url = await page.url()

    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pz-pagination__list [data-page]')).map(m => m.getAttribute('data-page')).filter(Number).map(m => parseInt(m))))
    // const totalPages = Math.ceil(productCount / 48)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }