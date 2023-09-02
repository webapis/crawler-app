

const { RequestQueue  } =require ('crawlee');
async function handler(page, context) {

    const { request: { userData: { start,pageOrder } } } = context
    const requestQueue = await RequestQueue.open();
debugger
let i =0

if(start){

    const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>m.href).filter(f=>f.includes('https://www.dilvin.com.tr/')) ) 
        debugger
        console.log('links',links)
    
        for(let l of links){
        
            i =i+1
            await  requestQueue.addRequest({url:l,  userData:{start:false,pageOrder:i} })
        }
  
    }
const url = await page.url()
console.log('url----',url)
const productPage = await page.$('.category-product')

    if(productPage){
        const pageInfo = await page.evaluate(()=>{
            return {
                title :document.title,
                minPrice:0,
                maxPrice:0,
                total:0,
                link:document.baseURI
            }
        })
console.log('pageInfo',pageInfo)
            const data = await page.$$eval('.product', (productCards) => {
                return productCards.map(document => {
                        try {
                            const title = document.querySelector('.dl-event')? document.querySelector('.dl-event').getAttribute('title'): document.querySelector('.image-hover.hover-nav a').getAttribute('title')
                            const img= document.querySelector('.dl-event img')? document.querySelector('.dl-event img').getAttribute('data-src'):document.querySelector('.image-hover.hover-nav a img').src
                            const priceNew =document.querySelector('.price-sales') ?document.querySelector('.price-sales').innerHTML.replace('TL','').trim():(document.querySelector('.camp-price') ? document.querySelector('.camp-price').innerHTML.replace('TL','').trim():null)
                            const link = document.querySelector('.dl-event')? document.querySelector('.dl-event').href:document.querySelector('.image-hover.hover-nav a').href
                
                            return {
                                title: 'dilvin '+title.replace(/İ/g,'i').replaceAll('-',' ').toLowerCase(),
                                priceNew,//:priceNew.replace(',','.'),
                                imageUrl: img.substring(img.indexOf('https://kvyfm6d9dll6.merlincdn.net/productimages/')+49),
                                link:link.substring(link.indexOf('https://www.dilvin.com.tr/')+26),
                                timestamp: Date.now(),
                                marka: 'dilvin',
                
                            }    
                        } catch (error) {
                            return {error:error.toString(),content:document.innerHTML}
                        }
            
                }).filter(f => f.priceNew !== null)
            })
        
        debugger
        console.log('data line one',pageOrder ,'of')
        return [{pageInfo,products:data.filter((f,i)=>i<7)}]
    
        }else{

            return []
        }

}
async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });
}
async function getUrls(page) {
    //const url = await page.url()
    // const nextPageExists = await page.$('.pagination .last')
     const pageUrls = []
    // if(nextPageExists){
   
    //     const totalPages = await page.$eval('.pagination .last', element => parseInt(element.href.substring( element.href.lastIndexOf('=')+1)))
    //     debugger;
    //     for (let i = 2; i <= totalPages; i++) {
    //         pageUrls.push(`${url}?rpg=` + i)
    
    //     }
    // }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }