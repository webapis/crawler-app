
async function handler(page) {

debugger
    const url = await page.url()

    await page.waitForSelector('.item-grid')
    debugger

    const data = await page.$$eval('.product.product--zoom', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl =document.querySelector('[data-original]').getAttribute('data-original')
                const title = document.querySelector(".product-box-detail-image-link").getAttribute('title')
                 const priceNew =document.querySelector('.vl-basket-price')? document.querySelector('.vl-basket-price').innerText.replace('TL','').trim():document.querySelector('.product-prices').innerText.replace('TL','').trim()
                   const longlink = document.querySelector('.product__inside__name a').href
                 const link = longlink.substring(longlink.indexOf("https://www.kipling.com.tr/")+27)
      
                const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://img-kipling.mncdn.com/") + 30)
    
                return {
                    title:'kipling ' + title,
                     priceNew,
                 imageUrl: imageUrlshort,
                      link,
                    timestamp: Date.now(),
                    marka: 'kipling',
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

    const nextPageExist =await page.$(".pagination a")
    const pageUrls = []
    if(nextPageExist){
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination a')).map(m=>m.innerHTML).filter(Number)))

    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?pagenumber=` + i)
            --pagesLeft
    
    
        }
    }


    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }