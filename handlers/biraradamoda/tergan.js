

async function handler(page, context) {
 

    const url = await page.url()

    await page.waitForSelector('.item.itemauto')

    const data = await page.$$eval('.item.itemauto', (productCards) => {
        return productCards.map(productCard => {
            try {
                const imageUrl = productCard.querySelector('.product img') && productCard.querySelector('.product img').getAttribute('src')
                const title = productCard.querySelector(".product .description a").innerHTML.trim()
                const priceNew = productCard.querySelector('.p-value') ? productCard.querySelector('.p-value').textContent.trim().replace('TL', '').trim() : productCard.querySelector('.price-sales').textContent.trim().replace('TL', '').trim()
                const longlink = productCard.querySelector(".product .description a").href
                const link = longlink.substring(longlink.indexOf("https://www.tergan.com.tr/") + 26)
                //const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://www.tergan.com.tr/") + 26)
                return {
                    title: 'tergan ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,//: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'tergan',
                }  
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
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
    const url = await page.url()
    await page.waitForSelector('.cat-total-count')
    const productCount = await page.evaluate(()=>document.querySelector('.cat-total-count').innerText.replace(/[^\d]/g,''))
    const totalPages = Math.ceil(productCount / 96)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?rpg=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }