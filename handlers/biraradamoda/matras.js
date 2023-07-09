

async function handler(page, context) {


    const url = await page.url()
    debugger
    await page.waitForSelector('#listelenen_urunler')
    debugger
    const data = await page.$$eval('.product_box', (productCards) => {
        return productCards.map(productCard => {
            try {
                const imageUrl = productCard.querySelector('.product_image img').src
            const title = productCard.querySelector('.product_name').textContent.replaceAll('\n','') 
            const priceNew = productCard.querySelector('.turkcell-price span').innerHTML.replaceAll('\n', '').replace('TL', '')
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
            } catch (error) {
                return {
                    error:error.toString(),content:document.innerHTML
                }
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
    await page.waitForSelector('.filtreurun')
     const productCount = await page.evaluate(()=>parseInt(document.querySelector('.filtreurun').innerText.replace(/[^\d]/g,'')))
     const totalPages = Math.ceil(productCount / 32)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }