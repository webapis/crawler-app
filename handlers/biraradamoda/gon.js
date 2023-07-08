
async function handler(page) {

debugger
    const url = await page.url()

    await page.waitForSelector('#ProductPageProductList')
debugger 



    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {
try {
    const imageUrl = document.querySelector('.productImage a img').getAttribute('data-original')
    const title = document.querySelector('.productImage a').getAttribute('title')
    const priceNew = document.querySelector('.discountPrice').innerText.replace('₺','')
    const longlink = document.querySelector('.productImage a').href
    const link = longlink.substring(longlink.indexOf("https://www.gon.com.tr/") + 23)
    
    const imageUrlshort = imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/")+29)

    return {
        title: 'gon ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl: imageUrlshort,
        link,
        timestamp: Date.now(),
        marka: 'gon',
    }
} catch (error) {
    return {error,content:document.innerHTML}
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
    const nextPageExist =await page.$('.pageBorder a')
    const pageUrls = []
    if(nextPageExist){
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pageBorder a')).map(m=>m.innerText).filter(Number)))
   
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}&sayfa=` + i)
            --pagesLeft
    
    
        }

    }

  

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }