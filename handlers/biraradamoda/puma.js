
async function handler(page) {

debugger
    const url = await page.url()

    await page.waitForSelector('.products-grid')
debugger

    const data = await page.$$eval('.product-item', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl =document.querySelector('.product-item__media a img').getAttribute('data-src')
                const title = document.querySelector('.product-item__media a img').alt
                const priceNew = document.querySelector('.price').innerText.replace("₺",'').trim()
                const longlink = document.querySelector('.product-item__media a').href
                const link = longlink.substring(longlink.indexOf("https://tr.puma.com/") + 20)
   
                const imageUrlshort = imageUrl.substring(imageUrl.indexOf("https://images.puma.com/") + 24)
   
               return {
                    title: 'puma ' + title,
                    priceNew,
                   imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'puma',
               }
            } catch (error) {
                return {error:error.toString(),content:document.content}
            }
      
        })
    })
debugger
    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.page-products-count')
    const productCount = await page.$eval('.page-products-count', element => parseInt(element.innerHTML.replace(/[^\d]/ig,'')))
    const totalPages = Math.ceil(productCount / 36)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?p=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }