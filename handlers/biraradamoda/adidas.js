

async function extractor(page) {

 await  autoScroll(page)
    debugger;
    const data = await page.$$eval('.glass-product-card', (productCards) => {
        return productCards.map(productCard => {
            try {
                const longImage =  productCard.querySelector('.glass-product-card__assets-link img').srcset.split('w,')[5].replace('\n', '').replace('766w', '').trim()
                const title =  productCard.querySelector('.glass-product-card__assets-link img').alt
                const priceNew = productCard.querySelector('[ data-auto-id="gl-price-item"] div') && productCard.querySelector('[ data-auto-id="gl-price-item"] div').innerHTML.replace('TL', '').trim()
                const link =  productCard.querySelector('[data-auto-id="glass-hockeycard-link"]').href
    
                return {
                    title: 'adidas '+ title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: longImage.substring(longImage.indexOf('https://assets.adidas.com/images/') + 33),
                    link: link.substring(link.indexOf('https://www.adidas.com.tr/tr/') + 29),
                    timestamp: Date.now(),
                    marka: 'adidas'
                }
            } catch (error) {
                console.log('error body',error.toString(),productCard.baseURL,productCard.innerHTML)
                return {error:error.toString(),content:productCard.innerHTML}
            }
          
        }).filter(f => f.priceNew !== null)
    })

return data

}
const productPageSelector='[data-auto-id="product_container"]'
const linkSelector='[class^="_header_container"] a'
const linksToRemove=[
'https://www.adidas.com.tr/tr//help-topics-privacy_policy.html',
'https://www.adidas.com.tr/tr',
'https://www.adidas.com.tr/tr/erkek?grid=true',
"https://www.adidas.com.tr/tr/kosu_ayakkabisi_ara",
"https://www.adidas.com.tr/tr/erkek-ayakkabi?price_max=1199&price_min=1",
"https://www.adidas.com.tr/tr/erkek-giyim?price_max=849&price_min=1",
"https://www.adidas.com.tr/tr/kadin-ayakkabi?price_max=1080&price_min=1",
"https://www.adidas.com.tr/tr/kadin-giyim?price_max=949&price_min=1",
"https://www.adidas.com.tr/erkek"

]
const hostname='https://www.adidas.com.tr/'
const productItemsSelector='.glass-product-card'
const exclude=['.html','?start=']
const postFix =''

async function autoScroll(page) {
  // page.on("console", (message) => {
  //   console.log("Message from Puppeteer page:", message.text());
  // });
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      let inc = 0;

      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;

        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1;
      //  console.log("inc", inc);
        if (totalHeight >= scrollHeight - window.innerHeight) {
          if (inc === 10) {
            clearInterval(timer);
            resolve();
          }
        } else {
          inc = 0;
        }
      }, 150);
    });
  });
}
async function getUrls(page) {

  const url = await page.url()
  const nextPage = await page.$('[data-auto-id=pagination-pages-container]')
  const pageUrls = []
  let productCount = 0
  if(nextPage){
   
   const totalPages = await page.$eval('[data-auto-id=pagination-pages-container]', element => parseInt(element.innerText.replace(/[^\d]/g,'')))


   let pagesLeft = totalPages
   for (let i = 2; i <= totalPages; i++) {

       pageUrls.push(`${url}?start=` + i)
       --pagesLeft

   }
  }
 

   return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix }