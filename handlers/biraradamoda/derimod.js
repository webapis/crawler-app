

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.list-content-product-item')


    const data = await page.$$eval('.list-content-product-item', (productCards) => {
        return productCards.map(productCard => {
                try {
                    const imageUrl = productCard.querySelector('.img2')&&  productCard.querySelector('.img2').getAttribute('src')
                    const title = productCard.querySelector('.product-name').innerHTML.trim()
                    const priceNew = productCard.querySelector('.product-sale-price-list')? productCard.querySelector('.product-sale-price-list').textContent.trim().replace('TL', ''): productCard.querySelector('.product-sale-price').textContent.trim().replace('TL', '')
                    const longlink = productCard.querySelector('.img-holder a').href
                    const link = longlink.substring(longlink.indexOf("https://www.derimod.com.tr/") + 27)
                    const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://c0a146.cdn.akinoncloud.com/products/") + 44)
                    return {
                        title: 'derimod ' + title.replace(/İ/g,'i').toLowerCase(),
                        priceNew,
                        imageUrl: imageUrlshort,
                        link,
                        timestamp: Date.now(),
                        marka: 'derimod',
                    } 
                } catch (error) {
                    return{
                        error:error.toString(),content:document.innerHTML
                    }
                }
       
        })
    })

    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)

debugger
    console.log("process.env.GENDER ")
    const mapgender = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return mapgender
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.search-total-count')
   // const productCount = await page.evaluate(()=>parseInt( document.querySelector('.search-total-count').innerHTML.replace(/[^\d]/g, '')))
    const totalPages = await page.evaluate(()=> Math.max(...Array.from(document.querySelectorAll('.pagination-item')).map(m=>m.innerHTML.replace(/[^\d]/g, '')).filter(Number))) 
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }