
async function handler(page, context) {
 
    debugger;
    const url = await page.url()

    await page.waitForSelector('.product-grid')

    await autoScroll(page)
    debugger;


    const data = await page.$$eval('.product', (productCards) => {
        return productCards.map(productCard => {
              const title = productCard.querySelector(".product-info .name a").innerHTML.replace(/\n/g, '').trim()
             const img= productCard.querySelector(".product-image").src
                        const priceNew =productCard.querySelector(".price").innerHTML.replace('TL', '').replace(/\n/g, '').trim()
              const link = productCard.querySelector(".image a").href

            return {
                  title:'tiffanytomato '+title.replace(/İ/g,'i').toLowerCase().replaceAll('-',' '),
                  priceNew:priceNew,//.replace(',','.'),
                 imageUrl: img.substring(img.indexOf('https://www.tiffanytomato.com.tr/')+33) ,
                 link:link.substring(link.indexOf('https://www.tiffanytomato.com.tr/')+33),
                 timestamp: Date.now(),
                  marka: 'tiffanytomato',

            }
        })
    })
    console.log('data length_____', data.length, 'url:', url)
debugger
    
    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
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
            }, 200);
        });
    });
}
async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
