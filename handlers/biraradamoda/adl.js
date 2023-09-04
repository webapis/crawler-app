
const { RequestQueue  } =require ('crawlee');
async function handler(page, context) {
    const { request: { userData: { start,pageOrder,title } } } = context
    const requestQueue = await RequestQueue.open();
debugger
let i =0
let totalPage =0
    debugger;
    if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>{return {href:m.href,title:m.innerHTML}}).filter(f=>f.href.includes('https://www.adl.com.tr/')) ) 
            debugger
            console.log('links',links)
            totalPage =links.length
            for(let l of links){
            
                i =i+1
                await  requestQueue.addRequest({url:l.href,  userData:{start:false,pageOrder:i,title:l.title} })
            }
      
        }
    const url = await page.url()
    console.log('url----',url)
    const productPage = await page.$('.products__items')
    if(productPage){

debugger

        const pageInfo = await page.evaluate(()=>{
            return {
                hrefText:title ,
                title :document.querySelector('.category-title .title').innerText,
                minPrice:Math.min(...Array.from(document.querySelectorAll(".filters .option__label-text")).map(m=>m.innerText).filter(f=>f.includes('TL')).map(m=> m.replace(/\([^)]*\)/g, '').split('-')).flat().map(m=>m.replace('TL','').trim() ).filter(Number)),
                maxPrice:Math.max(...Array.from(document.querySelectorAll(".filters .option__label-text")).map(m=>m.innerText).filter(f=>f.includes('TL')).map(m=> m.replace(/\([^)]*\)/g, '').split('-')).flat().map(m=>m.replace('TL','').trim() ).filter(Number)),
                total:parseInt(document.querySelector('.products-listed').innerText.replace(/[^\d]/g, "")),
                link:document.baseURI
            }
        })
console.log('pageInfo',pageInfo)
        debugger
        const data = await page.$$eval('.products__items .product-item', (productCards) => {
            return productCards.map(productCard => {
                const title = productCard.querySelector('.product-item__name.d-block').innerText.trim()
                const priceNew = Array.from(productCard.querySelectorAll('.price__new')).reverse()[0].innerText.replace('TL','').trim()
                const longlink = productCard.querySelector('.d-block.list-slider-item__link').href
                const link = longlink.substring(longlink.indexOf('https://www.adl.com.tr/') + 23)
                const longImgUrl = productCard.querySelector('.d-block.list-slider-item__link img').src
              //  const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://lmb-adl.akinoncdn.com/products/') + 39)
                debugger;
                return {
                    title: 'adl ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: longImgUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'adl',    
                }
            })//.filter(f => f.imageUrl !== null)
        })
        debugger;
        console.log('data length_____', data.length, 'url:', url)
    
      
        console.log('data line one',pageOrder ,'of', totalPage)
        return [{pageInfo,products:data.filter((f,i)=>i<7)}]

    } else{

        return []
    
    }


}

async function getUrls(page) {

  
    // const firstUrl = await page.url()
    // const nextPageExists = await page.$('.pagination__item')
    // const pageUrls = []
    // if(nextPageExists){
    //     const totalPages = await page.evaluate(() => {
    //         return document.querySelectorAll('.pagination__item')[document.querySelectorAll('.pagination__item').length - 2].innerHTML.replace(/[^\d]/g, "")
    //     })
    
      
    //     let pagesLeft = totalPages
    
    //     for (let i = 2; i <= totalPages; i++) {
    //         const url = `${firstUrl}?page=${i}`
    
    //         if (pagesLeft >= 1) {
    //             pageUrls.push(url)
    //             --pagesLeft
    //         }
    //     }
    // }
  


    return { pageUrls:[], productCount: 0, pageLength:[] }
}
module.exports = { handler, getUrls }