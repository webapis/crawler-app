
async function handler(page) {

    debugger
        const url = await page.url()
    
        await page.waitForSelector('#ProductPageProductList')
    debugger
    
    const data = await page.$$eval('#ProductPageProductList .ItemOrj.col-4', (productCards) => {
        return productCards.map(document => {
            try {
                // 
                const imageUrl = document.querySelector('[data-original]')? document.querySelector('[data-original]').getAttribute('data-original'):document.querySelector('.productSliderImage').src
                const title = document.querySelector('.productName.detailUrl a').innerHTML.trim()
                const priceNew = document.querySelector('.discountPrice span').innerHTML.replace('₺', '').replace(/\n/g, '').trim()
                const longlink = document.querySelector('.productName.detailUrl a').href
                const link = longlink.substring(longlink.indexOf("https://www.armine.com/") + 23)
                const imageUrlshort = imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") + 29)
    
                return {
                    title: 'armine ' + title,
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'armine',
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
       const nextPageExits = await page.$('.totalItems')
       const pageUrls = []
       let productCount =0
       if(nextPageExits){
         productCount = await page.$eval('.totalItems', element => parseInt(element.innerHTML))
        const totalPages = Math.ceil(productCount / 70)

    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft
    
    
        }
       }
     
    
        return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
    }
    module.exports = { handler, getUrls }