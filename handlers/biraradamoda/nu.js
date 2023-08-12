
async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('#CollectionProductGrid')
    await autoScroll(page)

    const data = await page.$$eval('article.product-item', (productCards) => {
        return productCards.map(document => {

            const imageUrl =document.querySelector('.product-item-image[data-srcset]')&&  document.querySelector('.product-item-image').getAttribute('data-srcset').split(',').reverse()[0].trim()
            const title = document.querySelector('.product--item-title a').innerText
            const priceNew = Array.from(document.querySelector('.product-item-price').querySelectorAll('span')).map(m=>m.innerText.replace('₺','').trim()).sort().reverse()[0]
            const longlink = document.querySelector('.product--item-title a').href
            const link = longlink.substring(longlink.indexOf("https://www.nu.com.tr/") + 22)
            const longImgUrl = imageUrl && imageUrl.substring(imageUrl.indexOf('//cdn.shopify.com/')+18)
          //  const imageUrlshort = imageUrl && longImgUrl.substring(longImgUrl.indexOf("//") + 1)

            return {
                title: 'nu ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: longImgUrl,
                link:longlink,
                timestamp: Date.now(),
                marka: 'nu',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)

debugger
    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}


async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

async function getUrls(page) {
    const url = await page.url()
       const nextPageExist = await page.$('.pagination-parts')
       const pageUrls = []
       if(nextPageExist){
        await page.waitForSelector('.pagination-parts')
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination-parts a')).map(m=>m.innerText).filter(Number)))
      
    
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
    
    
        }

       }
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }