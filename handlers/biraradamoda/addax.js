

const { RequestQueue  } =require ('crawlee');
async function handler(page,context) {

    const { request: { userData: { start } } } = context
    const requestQueue = await RequestQueue.open();

        if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>m.href).filter(f=>f.includes('https://www.addax.com.tr/')) ) 
            debugger
            for(let l of links){
            
                await  requestQueue.addRequest({url:l,  userData:{start:false} })
            }
      
        }
    const url = await page.url()

    debugger;

    const productPage = await page.$('.PrdContainer')
if(productPage){

    await page.waitForSelector('#MinPrice')
    await page.waitForSelector('#MaxPrice')
    const pageInfo = await page.evaluate(()=>{
        return {
            title :document.title,
            minPrice:document.querySelector('#MinPrice').value.trim(),
            maxPrice:document.querySelector('#MaxPrice').value.trim(),
            total:0,
            link:document.baseURI
        }
    })

    debugger
    const data = await page.$$eval('.Prd', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = Array.from(document.querySelector('.SalesAmount').querySelectorAll('.PPrice')).reverse()[0].innerHTML.replace('TL', '').trim()
                const longlink = document.querySelector('a[data-product').href
                const link = longlink.substring(longlink.indexOf("https://www.addax.com.tr/") + 25)
                const longImgUrl = document.querySelector("img[data-src]").getAttribute('data-src')
                const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://cdn3.sorsware.com/") + 26)//https://cdn3.sorsware.com/
                const title = document.querySelector("img[data-src]").alt
                return {
                    title: 'addax ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'addax',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
  
        })
    })



    //----------

    console.log('data length_____', data.length, 'url:', url)

debugger
    return [{pageInfo,products:data.filter((f,i)=>i<7)}]
}

else{
    return []
}


}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}

// async function autoScroll(page) {
//     await page.evaluate(async () => {


//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             let inc = 0
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;

//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 inc = inc + 1
//                 if (totalHeight >= scrollHeight - window.innerHeight) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 150);
//         });
//     });
// }
module.exports = { handler, getUrls }

