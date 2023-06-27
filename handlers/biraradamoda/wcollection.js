

async function handler(page, context) {
  

    const url = await page.url()

    await page.waitForSelector('#ListProductWrapper')


    const data = await page.$$eval('.product-item', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.slider-image-container img').getAttribute('data-src')
            const title = document.querySelector('.product-item__name').innerText
            const priceNew = document.querySelector('.discount-price')?document.querySelector('.discount-price').innerText.replace('₺','').trim().replace(/[a-z]/gi, '') :document.querySelector('.product-item-price-wrapper').innerText.replace('₺','').trim().replace(/[a-z]/gi, '') 
            const longlink = document.querySelector('.product-item__name[href]').getAttribute('href')
            const link = longlink.substring(1)
    
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://vakko-wcollection.akinoncdn.com/") + 40)

            return {
                title: 'wcollection ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'wcollection',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.list__filters__item-count--number')
    const productCount = await page.$eval('.list__filters__item-count--number', element => parseInt(element.innerText))
    const totalPages = Math.ceil(productCount / 48)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
        --pagesLeft

    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }