
async function handler(page) {

    debugger
        const url = await page.url()
    
        await page.waitForSelector('#products')
    debugger
    
        const data = await page.$$eval('.products__item', (productCards) => {
            return productCards.map(document => {
                try {
                    const imageUrl = Array.from(document.querySelectorAll(".product__imageList img")).reverse().map(m=>m.getAttribute("data-original"))[0]
                    const title = document.querySelector("a.product__imageWrapper").getAttribute("title").trim()
                    const priceNew = document.querySelector(".product__price.-actual").innerText.replace("TL",'').trim()
                    const longlink = document.querySelector("a.product__imageWrapper").href
                    const link = longlink.substring(longlink.indexOf("https://www.divarese.com.tr/") + 28)
                   
                    const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://img-divarese.mncdn.com/") + 31)
       
                   return {
                        title: 'divarese ' + title,
                       priceNew,
                        imageUrl: imageUrlshort,
                       link,
                        timestamp: Date.now(),
                        marka: 'divarese',
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
        await page.waitForSelector('.js-total-products-count')
        const productCount = await page.$eval('.js-total-products-count', element => parseInt(element.innerHTML))
        const totalPages = Math.ceil(productCount / 60)
        const pageUrls = []
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
    
    
        }
    
        return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
    }
    module.exports = { handler, getUrls }