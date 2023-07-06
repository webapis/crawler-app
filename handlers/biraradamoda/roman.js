
async function handler(page, context) {

    debugger;
    const url = await page.url()

    await page.waitForSelector('.product-detail-card')


    const data = await page.$$eval('.product-item', (productCards) => {
        return productCards.map(document => {
try {
    const title = document.querySelector('a.product-title') && document.querySelector('a.product-title').innerText
    const priceNew = document.querySelector('.product-price').innerText.replace('₺', '').trim()
    const longlink = document.querySelector('a.product-title').href
    const link = longlink.substring(longlink.indexOf("https://www.roman.com.tr/") + 25)
    const longImgUrl = document.querySelector('source[data-srcset]').getAttribute('data-srcset')
    const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://cache.roman.com.tr/") + 27)
    return {
        title: 'roman ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-', ' '),
        priceNew,
        imageUrl: imageUrlshort,
        link,
        timestamp: Date.now(),
        marka: 'roman',
    }
} catch (error) {
    return {error:error.toString(),content:document.innerHTML}
}
        
        })
    })

    console.log('data length_____', data.length, 'url:', url)
    debugger
    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}

async function getUrls(page) {
    const url = await page.url()
    debugger;
    await page.waitForSelector('.pagination a')
    const totalPages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerText).filter(Number).map(m => parseInt(m)).sort().reverse()[0]
    })
    debugger;

    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?pg=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }