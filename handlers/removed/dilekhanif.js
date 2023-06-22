

async function handler(page, context) {
    const { request: { userData: { subcategory, category, start } } } = context
    debugger;
    const url = await page.url()
    const numberOfProd = await page.$eval('.productItem', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
    debugger;
    await page.waitForSelector('#ProductPageProductList')
    await autoScroll(page);
    debugger;
   // await page.waitForFunction(`document.querySelectorAll('.imageItem img').length===${numberOfProd}`);
    await page.waitFor(3000)
    debugger;
    const data = await page.$$eval('#ProductPageProductList .productItem', (productCards, _subcategory, _category) => {
        return productCards.map(productCard => {


            const title = productCard.querySelector('.productName a[title]').getAttribute('title').trim()
            const priceNew = productCard.querySelector('.discountPrice span').innerText.replace('₺', '').trim()
            const longlink = productCard.querySelector('.detailLink.detailUrl').href
            const link = longlink.substring(longlink.indexOf('https://www.dilekhanif.com/') + 27)
            const longImgUrl = productCard.querySelector('.productImage.productImageOwlSlider')?productCard.querySelector('.productSliderImage').src : (productCard.querySelector('.resimOrginal').src ?productCard.querySelector('.resimOrginal').src :productCard.querySelector('.resimOrginal').getAttribute('data-original')  )
            const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.dilekhanif.com/Uploads/UrunResimleri/thumb/') + 55)
//data-original
            return {
                title,
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'dilekhanif',
                subcategory: _subcategory,
                category: _category
            }
        })
    }, subcategory, category)

    console.log('data length_____', data.length, 'url:', url)



    debugger;
    return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}

async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                var toth = 7775
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
module.exports = { handler, getUrls }


/*
async function autoScroll(page){
    await page.evaluate(async () => {
     const numberOfProd=parseInt(document.querySelector('.appliedFilter.FiltrelemeUrunAdet span').textContent.replace(/[^\d]/g, ""))
   
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc =0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                var toth=7775
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc= inc+1
                if(totalHeight >= scrollHeight - window.innerHeight && inc >= numberOfProd){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
*/