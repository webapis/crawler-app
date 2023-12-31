
async function handler(page, context) {

    const url = await page.url()
debugger
    await page.waitForSelector('[data-product-id]')
    debugger;

    //await autoScroll(page)

    
    const data = await page.evaluate(() => {

        const items = Array.from(document.querySelectorAll('[data-product-id]'))
        return items.map(item => {
                try {
                    const priceNew = item.querySelector('.prd-price .urunListe_satisFiyat') && item.querySelector('.prd-list .prd-price .urunListe_satisFiyat').textContent.replace('\n', '').replace('₺', '').trim()

                    debugger;
        
                    const longlink = item.querySelector('a.prd-lnk.clicked-item') && item.querySelector('a.prd-lnk.clicked-item').href
                    const link = longlink && longlink.substring(longlink.indexOf('https://www.ipekyol.com.tr/') + 27)
                    const longImgUrl = item.querySelector('[data-image-src]') && item.querySelector('[data-image-src]').getAttribute('data-image-src')
                    const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://img2-ipekyol.mncdn.com/mnresize/') + 40)
                    return {
                        title: item.querySelector('.prd-name span') && 'ipekyol ' + item.querySelector('.prd-name span').innerHTML.replace(/İ/g, 'i').toLowerCase(),
        
                        priceNew,//:priceNew.replace('.','').replace(',00','').trim(),
        
                        imageUrl: imageUrlshort,
                        link,
        
                        timestamp: Date.now(),
        
                        marka: 'ipekyol',
        
        
        
                    }   
                } catch (error) {
                    return {error:error.toString(),content:document.innerHTML
                    }
                }
   
         })
    })

debugger
    console.log('data length_____', data.length, 'url:', url)

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}
async function autoScroll(page) {
    page.on("console", (message) => {
        console.log("Message from Puppeteer page:", message.text());
      });
    await page.evaluate(async () => {

 const totalProducts =parseInt(document.querySelector('.categories-title span').innerText.replace(/[^\d]/g,''))
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {

                const totalCollected =document.querySelectorAll('[data-product-id]').length
                var scrollHeight = document.body.scrollHeight;
                console.log("totalCollected:", totalCollected,'totalProducts:',totalProducts);
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalCollected===totalProducts) {
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        });
    });
}

async function getUrls(page, param) {

    const url = await page.url()
    const productCount = await page.evaluate(()=>parseInt(document.querySelector('.categories-title span').innerText.replace(/[^\d]/g,''))) 

    const totalPages = Math.ceil(productCount / 15)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }