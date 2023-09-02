
const { RequestQueue  } =require ('crawlee');
async function handler(page,context) {
    const { request: { userData: { start } } } = context
    const requestQueue = await RequestQueue.open();
debugger
    if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>m.href).filter(f=>f.includes('https://www.adidas.com.tr/')) ) 
            debugger
            console.log('links',links)
            for(let l of links){
            
                await  requestQueue.addRequest({url:l,  userData:{start:false} })
            }
      
        }
    const url = await page.url()
    console.log('url----',url)
    const productPage = await page.$('[data-auto-id="product_container"]')
    console.log('productPage exists',url,productPage)
    if(productPage){
debugger
console.log('clicking filter')
        await page.waitForSelector('[data-auto-id="filter-panel-cta-btn"]')
        await page.click('[data-auto-id="filter-panel-cta-btn"]')
        console.log('filter clicked')
        debugger
        const pageInfo = await page.evaluate(()=>{
            return {
                title :document.title,
                minPrice:document.querySelector('[data-auto-id=price-wrapper]').innerText.split('-')[0].replace('TL','').trim(),
                maxPrice:document.querySelector('[data-auto-id=price-wrapper]').innerText.split('-')[1].replace('TL','').trim(),
                total:0,
                link:document.baseURI
            }
        })
        console.log('pageInfo',pageInfo)
  
    debugger;
    const data = await page.$$eval('.grid-item', (productCards) => {
        return productCards.map(productCard => {

            const longImage = productCard.querySelector('.glass-product-card__assets-link img') && productCard.querySelector('.glass-product-card__assets-link img').srcset.split('w,')[5].replace('\n', '').replace('766w', '').trim()
            const title = productCard.querySelector('.glass-product-card__assets-link img') && productCard.querySelector('.glass-product-card__assets-link img').alt
            const priceNew = productCard.querySelector('[ data-auto-id="gl-price-item"] div') && productCard.querySelector('[ data-auto-id="gl-price-item"] div').innerHTML.replace('TL', '').trim()
            const link = productCard.querySelector('[data-auto-id="glass-hockeycard-link"]').href

            return {
                title: 'adidas '+ title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: longImage.substring(longImage.indexOf('https://assets.adidas.com/images/') + 33),
                link: link.substring(link.indexOf('https://www.adidas.com.tr/tr/') + 29),
                timestamp: Date.now(),
                marka: 'adidas'
            }
        }).filter(f => f.priceNew !== null)
    })

    console.log('data length_____', data.length, 'url:', url)

    console.log('data line one',data)
    return [{pageInfo,products:data.filter((f,i)=>i<7)}]

}else{
    console.log('data line two')
    return []
}
}

async function getUrls(page) {
   

    return { pageUrls:[], productCount: 0, pageLength: 0 }
}
module.exports = { handler, getUrls }