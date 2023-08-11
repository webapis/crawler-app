

async function handler(page, context) {


    const url = await page.url()
    debugger
    await page.waitForSelector('.catalogWrapper')
    await page.waitForSelector('span b')
    debugger

  //  await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl = document.querySelector('span[itemprop="image"]').getAttribute('content')
                const title = document.querySelector('.productItem a[title]').innerText
                const priceNew = document.querySelector('.currentPrice').innerText.replace('TL', '').trim()
                const longlink = document.querySelector('.productItem a[title]').href
             const link = longlink.substring(longlink.indexOf("https://www.tommylife.com.tr/") + 29)
    
               // const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://cdn.tommylife.com.tr/") + 29)
    
                return {
                    title: 'tommylife ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl, //imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'tommylife',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
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




async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
              
                const totalCollected = document.querySelectorAll('.productItem').length
                const totalItems = parseInt(document.querySelector('.uluLeft b').innerText)

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalCollected === totalItems) {
                    clearInterval(timer);
                    resolve();
                }
            }, 250);
        });
    });
}
async function getUrls(page) {
  const url = await page.url()
      await page.waitForSelector('span b')
     const productCount = await page.$eval('span b', element => parseInt(element.innerText))
    const totalPages =  Math.round(productCount/4) //await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.page_numbers span')).map(m => m.innerHTML).filter(Number)))
    const pageUrls = []
    pageUrls.push(`${url}?ps=` + totalPages)


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }