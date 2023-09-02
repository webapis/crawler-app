

const { RequestQueue  } =require ('crawlee');
async function handler(page, context) {

    const { request: { userData: { start,pageOrder } } } = context
    const requestQueue = await RequestQueue.open();
debugger
let i =0
let totalPage =0
    debugger;
    if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>m.href).filter(f=>f.includes('https://www.alpinist.com.tr/')) ) 
            debugger
            console.log('links',links)
            totalPage =links.length
            for(let l of links){
            
                i =i+1
                await  requestQueue.addRequest({url:l,  userData:{start:false,pageOrder:i} })
            }
      
        }
        debugger
    const url = await page.url()

    const productPage = await page.$('.showcase-container')
    if(productPage){
        const pageInfo = await page.evaluate(()=>{
            return {
                title :document.title,
                minPrice:0,
                maxPrice:0,
                total:parseInt(document.querySelector('.record-count').innerText.replace(/[^\d]/g, "")),
                link:document.baseURI
            }
        })
        debugger
        console.log('pageInfo',pageInfo)
        const data = await page.$$eval('.showcase-container .row', (productCards) => {
            return productCards.map(document => {
                const brand =document.querySelector('.showcase-brand a').innerText
                const imageUrl = document.querySelector('.showcase-image img').getAttribute('data-src')
                const title = brand +' '+ document.querySelector('.showcase-title').innerText
          
                const priceNew = document.querySelector('.showcase-price-new').innerText.replace('TL','').trim()
                const longlink = document.querySelector('.showcase-image a').href
             
    
    
                return {
                    title: 'alpinist ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link:longlink,
                    timestamp: Date.now(),
                    marka: 'alpinist',
                }
            }).filter(f => f.imageUrl !== null && f.title.length > 5)
        })
    
        console.log('data length_____', data.length, 'url:', url)
    
      
        console.log('data line one',pageOrder ,'of', totalPage)
        return [{pageInfo,products:data.filter((f,i)=>i<7)}]
    }
else
{
    return[]
}
    
   
}

async function getUrls(page) {
    
//     const url = await page.url()
//     await page.waitForSelector('.products-nb-per-page')
//     const productCount = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.dropdown-menu a')).map(m=>m.innerHTML.trim()).filter(Number)))

//     const pageUrls = []

// debugger
//     pageUrls.push(`${url}?p?order=product.position.asc&resultsPerPage=` + productCount)





    return { pageUrls:[], productCount:0, pageLength: 0 }

}
module.exports = { handler, getUrls }