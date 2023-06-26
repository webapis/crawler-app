const { Dataset  } =require ('crawlee');
function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()
    await page.waitForSelector('.product-grid-block-dynamic.product-grid-block-dynamic__container')
    debugger
    await page.click('.filters__button')
    const productsCount = await page.evaluate(()=>parseInt(document.querySelector('.filters-panel__buttons-results').textContent.match(/\d+/g)))
    debugger


await autoScroll(page,productsCount)
debugger


const data = await page.$$eval('[data-productid]', (productCards) => {
    return productCards.map(productCard => {
        const priceNew =productCard.querySelector('.money-amount__main')&& productCard.querySelector('.money-amount__main').textContent.match(/\d+/g)
        const longlink =productCard.querySelector('.product-link')&& productCard.querySelector('.product-link').href
        const link = longlink.substring(longlink.indexOf("https://www.zara.com/tr/tr/") + 27)
        const longImgUrl = productCard.querySelector('.product-link img')&& productCard.querySelector('.product-link img').src
        const imageUrlshort =longImgUrl&&  longImgUrl.substring(longImgUrl.indexOf("https://static.zara.net/photos/") + 31)
       const title = productCard.querySelector('.product-link H3')&&  productCard.querySelector('.product-link H3').textContent
        return {
          title: 'zara ' + title,
           priceNew,
            imageUrl: imageUrlshort,
            link,
            timestamp: Date.now(),
            marka: 'zara',

        }
    })
});

    console.log('data length_____', data.length, 'url:', url)



    debugger
    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}

async function autoScroll(page,productsCount) {
  return   await page.evaluate(async (count) => {

        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                const totalItems =document.querySelectorAll('[data-productid]').length
            
                window.scrollBy(0, distance);
             1
                if (totalItems===count) {
                    clearInterval(timer);
                    resolve(count);
                }
            }, 150);
        });
    },productsCount);
}
module.exports = { handler, getUrls }

