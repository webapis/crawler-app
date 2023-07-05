


async function handler(page) {

    const url = await page.url()

    debugger;

    await page.waitForSelector('.ProductList',{timeout:180000})
  // const totalProducts= await page.evaluate(()=>parseInt(document.querySelector("[for^=sidebar-filter-p-product_type]").innerText.replace(/[^\d]/g,"")))
    await autoScroll(page);

    debugger
    const data = await page.$$eval('.ProductItem', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector('.ProductItem__Price').innerText.replace('TL','')
                const longlink = document.querySelector(".ProductItem__Title.Heading a").href
                 const link = longlink.substring(longlink.indexOf("https://www.bagmori.com/") + 24)
                const longImgUrl =Array.from(document.querySelectorAll('.ProductItem__Image')).reverse()[0].getAttribute('data-srcset')? Array.from(document.querySelectorAll('.ProductItem__Image')).reverse()[0].getAttribute('data-srcset').split(",")[5].trim():Array.from(document.querySelectorAll('.ProductItem__Image')).reverse()[0].getAttribute('data-src').trim()
                 const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("//cdn.shopify.com/") + 18)//https://cdn3.sorsware.com/
                const title = document.querySelector(".ProductItem__Title.Heading a").innerText
                return {
                    title: 'bagmori ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'bagmori',
                }
            } catch (error) {
                return {error,content:document.innerHTML}
            }
        
        })
    })



    //----------

    console.log('data length_____', data.length, 'url:', url)



    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}

async function autoScroll(page) {
    await page.evaluate(async () => {

        const totalProducts= parseInt( document.querySelector("[for^=sidebar-filter-p-product_type]").innerText.replace(/[^\d]/g,""))
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
          
            const totalCollected =document.querySelectorAll(".ProductItem").length
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalProducts===totalCollected) {
                  
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });
}
module.exports = { handler, getUrls }

