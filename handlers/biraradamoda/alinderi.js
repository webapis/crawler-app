

const { RequestQueue  } =require ('crawlee');
async function handler(page, context) {

    const { request: { userData: { start,pageOrder } } } = context
    const requestQueue = await RequestQueue.open();
debugger
let i =0
let totalPage =0
    debugger;
    if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>m.href).filter(f=>f.includes('https://alinderi.com.tr/')) ) 
            debugger
            console.log('links',links)
            totalPage =links.length
            for(let l of links){
            
                i =i+1
                await  requestQueue.addRequest({url:l,  userData:{start:false,pageOrder:i} })
            }
      
        }
    const url = await page.url()
    const productPage = await page.$('#js-product-list')
    if(productPage){
        const pageInfo = await page.evaluate(()=>{
            return {
                title :document.querySelector('.category-title .title').innerText,
                minPrice:Math.min(...Array.from(document.querySelectorAll(".filters .option__label-text")).map(m=>m.innerText).filter(f=>f.includes('TL')).map(m=> m.replace(/\([^)]*\)/g, '').split('-')).flat().map(m=>m.replace('TL','').trim() ).filter(Number)),
                maxPrice:Math.max(...Array.from(document.querySelectorAll(".filters .option__label-text")).map(m=>m.innerText).filter(f=>f.includes('TL')).map(m=> m.replace(/\([^)]*\)/g, '').split('-')).flat().map(m=>m.replace('TL','').trim() ).filter(Number)),
                total:parseInt(document.querySelector('.products-listed').innerText.replace(/[^\d]/g, "")),
                link:document.baseURI
            }
        })
console.log('pageInfo',pageInfo)
        const data = await page.$$eval('.js-product-miniature-wrapper', (productCards) => {
            return productCards.map(document => {
    
                const imageUrl = document.querySelector('[data-full-size-image-url]').getAttribute('data-full-size-image-url')
                const title = document.querySelector('.product-title').innerText.trim()
                const priceNew = document.querySelector('.product-price').innerText.trim().replace('₺', '')
                const longlink = document.querySelector('.product-title a').href
                const link = longlink.substring(longlink.indexOf("https://www.alinderi.com.tr/") + 28)
    
    
                return {
                    title: 'alinderi ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'alinderi',
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