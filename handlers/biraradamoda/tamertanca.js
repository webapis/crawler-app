
async function handler(page) {

    debugger
        const url = await page.url()
    
        await page.waitForSelector('.js-list-products')
    debugger
    
        const data = await page.$$eval('.product-item', (productCards) => {
            return productCards.map(document => {
    try {
        const imageUrl = document.querySelector(".slider-item img").getAttribute('data-src')
        const title = document.querySelector(".slider-item img").alt
       const priceNew = document.querySelector(".product-info__offer-price").innerText.replace("TL",'').trim()
        const longlink = document.querySelector(".product-item a").href
       const link = longlink.substring(longlink.indexOf("https://www.tamertanca.com.tr/") + 30)

        const imageUrlshort = imageUrl.substring(imageUrl.indexOf("https://2d9718.cdn.akinoncloud.com/") + 35)

       return {
           title: 'tamertanca ' + title.replace(/İ/g,'i').toLowerCase(),
           priceNew,
           imageUrl: imageUrlshort,
           link,
           timestamp: Date.now(),
           marka: 'tamertanca',
       }
    } catch (error) {
        return {error:error.toString(),content:document.innerHTML}
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
        await page.waitForSelector('.size')
        const productCount = await page.$eval('.size', element => parseInt(element.innerText.replace(/[^\d]/gi,'')))
        const totalPages = Math.ceil(productCount / 24)
        const pageUrls = []
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
    
    
        }
    
        return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
    }
    module.exports = { handler, getUrls }