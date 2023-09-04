
const { RequestQueue  } =require ('crawlee');
async function handler(page,context) {
    const { request: { userData: { start,pageOrder,title } } } = context
    const requestQueue = await RequestQueue.open();
    let i =0
    global.totalPage =0
debugger
    if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>{return {href:m.href,title:m.innerText.replaceAll('\n','').trim()}}).filter(f=>f.href.includes('https://www.adidas.com.tr/')) ) 
            debugger
            console.log('links',links)
            global.totalPage =links.length
            for(let l of links){
                i =i+1
                await  requestQueue.addRequest({url:l.href,  userData:{start:false,pageOrder:i,title:l.title} })
            }
      
        }
    const url = await page.url()
    page.on("console", (message) => {
        console.log("Message from Puppeteer page:", message.text());
      });
 
    const productPage = await page.$('[data-auto-id="product_container"]')
    const productExits = await page.$('[data-auto-id=price-wrapper]')
    if(productPage  && productExits){
debugger
      //  await autoScroll(page)

        await page.waitForSelector('[data-auto-id="filter-panel-cta-btn"]')
        await page.click('[data-auto-id="filter-panel-cta-btn"]')
        await page.waitForSelector('[data-auto-id="price-wrapper"]')
        debugger
        const pageInfo = await page.evaluate((title)=>{
            try {
                return {
                    hrefText:title ,
                    title :document.title,
                    minPrice:document.querySelector('[data-auto-id="price-wrapper"]').innerHTML.split('-')[0].replace('TL','').trim(),
                    maxPrice:document.querySelector('[data-auto-id="price-wrapper"]').innerHTML.split('-')[1].replace('TL','').trim(),
                    total:parseInt( document.querySelector('[data-auto-id="plp-header-bar-products-count"]').innerHTML.replace(/[^\d]/g, "")),
                    link:document.baseURI
                }
            } catch (error) {
                console.log('error head',error.toString(),document.baseURI,document.querySelector('[data-auto-id="price-wrapper"]').innerHTML,'---',document.querySelector('[data-auto-id="plp-header-bar-products-count"]').innerHTML )
                return {error:error.toString(),url:document.baseURI}
            }
          
        },title)
 
        console.log('pageInfo',pageInfo)
    debugger;
    // const data = await page.$$eval('.glass-product-card', (productCards) => {
    //     return productCards.map(productCard => {
    //         try {
    //             const longImage =  productCard.querySelector('.glass-product-card__assets-link img').srcset.split('w,')[5].replace('\n', '').replace('766w', '').trim()
    //             const title =  productCard.querySelector('.glass-product-card__assets-link img').alt
    //             const priceNew = productCard.querySelector('[ data-auto-id="gl-price-item"] div') && productCard.querySelector('[ data-auto-id="gl-price-item"] div').innerHTML.replace('TL', '').trim()
    //             const link =  productCard.querySelector('[data-auto-id="glass-hockeycard-link"]').href
    
    //             return {
    //                 title: 'adidas '+ title.replace(/İ/g,'i').toLowerCase(),
    //                 priceNew,
    //                 imageUrl: longImage.substring(longImage.indexOf('https://assets.adidas.com/images/') + 33),
    //                 link: link.substring(link.indexOf('https://www.adidas.com.tr/tr/') + 29),
    //                 timestamp: Date.now(),
    //                 marka: 'adidas'
    //             }
    //         } catch (error) {
    //             console.log('error body',error.toString(),productCard.baseURL,productCard.innerHTML)
    //             return {error:error.toString(),content:productCard.innerHTML}
    //         }
          
    //     }).filter(f => f.priceNew !== null)
    // })

    console.log('url completed successfully ----',url)

    console.log('data line one',pageOrder)
    return [{pageInfo,products:[]}]

}else{
    console.log('data line two')
    return []
}
}

async function autoScroll(page) {
    page.on("console", (message) => {
      console.log("Message from Puppeteer page:", message.text());
    });
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
          console.log("inc", inc);
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

   

    return { pageUrls:[], productCount: 0, pageLength: 0 }
}
module.exports = { handler, getUrls }