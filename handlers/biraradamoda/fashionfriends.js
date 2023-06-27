
async function handler(page, context) {

    debugger;
    const url = await page.url()
    // const acceptcookies = await page.$('.insider-opt-in-notification-button.insider-opt-in-disallow-button')
    // if (acceptcookies) {
    //     await page.click('.insider-opt-in-notification-button.insider-opt-in-disallow-button')
    // }
    await page.waitForSelector('#ProductListMainContainer')

    await autoScroll(page)
    debugger;


    const data = await page.$$eval('.ItemOrj', (productCards) => {
        return productCards.map(productCard => {
              const title = productCard.querySelector(".productName.detailUrl a").innerHTML
              const img= productCard.querySelector("[data-original]").getAttribute('[data-original]')
             const priceNew =productCard.querySelectorAll(".sptPrice")[0].innerHTML.replace('TL', '').replace(/\n/g, '').trim()
               const link = productCard.querySelector(".productName.detailUrl a")

            return {
                   title:'fashionfriends '+title.replace(/İ/g,'i').toLowerCase(),
                   priceNew:priceNew,//.replace(',','.'),
                 imageUrl: img,//img.substring(img.indexOf('https://www.tiffanytomato.com.tr/')+33) ,
                  link,//:link.substring(link.indexOf('https://www.tiffanytomato.com.tr/')+33),
                  timestamp: Date.now(),
                   marka: 'fashionfriends',

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
