const { PuppeteerCrawler, Dataset,RequestQueue } =require('crawlee');

async function handler(page, context) {
    const defaultDataset = await Dataset.open();
    debugger;
    const url = await page.url()
    await page.waitForSelector('.js-product-list-cards')

await autoScroll(page)
const { items: productItems } = await defaultDataset.getData();


  
    // const data =productItems.filter(f=>f.data).map(m=>[...m.data]).flat().map(m=>{
    //     return {
           
    //         title: 'mavijeans ' +m.name.toLowerCase(),
    //         priceNew:m.price.TRY,
    //         imageUrl:m.image_url.substring(m.image_url.indexOf("https://sky-static.mavi.com/")+28),
    //         link: m.url.substring(m.url.indexOf("https://www.mavi.com/")+21),
    //         timestamp: Date.now(),
    //         marka: 'mavijeans',
    //     }
    // })
    debugger
    const data = await page.$$eval('.product-list-cards-inner .product-item', (items) => {
try {
    return items.map(document => {
        let productTitle = document.querySelector('.product-title').textContent
        let productDesc = document.querySelector('.product-desc').textContent
        const priceNew = document.querySelector('.price')? document.querySelector('.price').innerText.replace('TL', '').trim():document.querySelector('.ins-product-price').innerText.replace('TL', '')
        const longlink = document.querySelector('.product-card-info').href
        const link = longlink.substring(longlink.indexOf('https://www.mavi.com/') + 21)
        const imageUrlshort =  document.querySelector('[data-main-src]').getAttribute('data-main-src')// Array.from(document.querySelectorAll('[data-main-src]')).map(m=>m.getAttribute('data-main-src')).join(',')//.filter(f=>f.includes('jpg_Default-MainProductImage'))[0]
        return {
           
            title: 'mavijeans ' + productTitle.replace(/\n/g, '').trim() + ' ' + productDesc.replace(/\n/g, '').trim(),
            priceNew,
            imageUrl:imageUrlshort.substring(22),
            link,
            timestamp: Date.now(),
            marka: 'mavijeans',

        }
    })
} catch (error) {
    return {error:error.toString(),content:document.innerHTML}
}
    
    });

    debugger

    console.log('data length_____', data.length, 'url:', url)

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })


}
async function autoScroll(page) {
    page.on("console", (message) => {
        console.log("Message from Puppeteer page:", message.text());
      });
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1;
                console.log("inc", inc);
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    if (inc === 50) {
                      clearInterval(timer);
                      resolve();
                    }
                  } else {
                    inc = 0;
                  }
            }, 500);
        });
    });
}
async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.right-menu-item.product-number')
    const productCount = await page.$eval('.right-menu-item.product-number', element => parseInt(element.innerText.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}


module.exports = { handler, getUrls }