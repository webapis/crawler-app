
const { RequestQueue  } =require ('crawlee');
async function handler(page,context) {
    debugger
    const { request: { userData: { start } } } = context
    const requestQueue = await RequestQueue.open();

      //  if(start){

        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>m.href).filter(f=>f.includes('https://www.abiyefon.com/')) ) 
            debugger
            for(let l of links){
            
                await  requestQueue.addRequest({url:l,  userData:{start:false} })
            }
      
      //  }
    const url = await page.url()
   // await page.waitForSelector('.products')
    const productPage = await page.$('.products')
    if(productPage){

        await page.waitForSelector('.minPrice')
        await page.waitForSelector('.maxPrice')
        const pageInfo = await page.evaluate(()=>{
            return {
                title :document.title,
                minPrice:document.querySelector('.minPrice').innerHTML.replace('TL','').trim(),
                maxPrice:document.querySelector('.maxPrice').innerHTML.replace('TL','').trim(),
                total:document.querySelector('.count-info strong').innerHTML,
                link:document.baseURI
            }
        })

debugger
    const data = await page.$$eval('.products .product-link', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector("span[data-price]").innerHTML
                const longlink = document.href
                const link = longlink.substring(longlink.indexOf("https://www.abiyefon.com/") + 25)
                const longImgUrl = document.querySelector('img.product-list-image').src
                const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
                const title = document.querySelector('img.product-list-image').alt
                return {
                    title: 'abiyefon ' + title.toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'abiyefon'
                }  
            }
            catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
        }).filter(f => f.imageUrl !== null  && f.link !==null)
    })

    console.log('data length_____', data.length, 'url:', url)

    const formatprice = data.map((m) => {
        return { ...m,title:m.title+" _"+process.env.GENDER }
    })

    return [{pageInfo,products:formatprice.filter((f,i)=>i<7)}]
}else{
    return []
}


}

async function getUrls(page) {
 

    return { pageUrls:[], productCount:0, pageLength:0 }
}

// async function getUrls(page) {
//     const url = await page.url()
//     await page.waitForSelector('.count-info-text strong')
//     const productCount = await page.$eval('.count-info-text strong', element => parseInt(element.textContent))
//     const totalPages = Math.ceil(productCount / 100)
//     const pageUrls = []

//     let pagesLeft = totalPages
//     for (let i = 2; i <= totalPages; i++) {



//         pageUrls.push(`${url}?page=` + i)
//         --pagesLeft


//     }

//     return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
// }
module.exports = { handler, getUrls }
























// const data = await page.$$eval('.products li', (productCards, _subcategory, _category, _opts) => {
//     return productCards.map(productCard => {
//         const priceNew = productCard.querySelector("span[data-price]") ? productCard.querySelector("span[data-price]").getAttribute('data-price').replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim() : productCard.outerHTML
//         const longlink = productCard.querySelector('.product-link') ? productCard.querySelector('.product-link').getAttribute('data-purehref') : productCard.outerHTML
//         const link = longlink.substring(longlink.indexOf("/") + 1)
//         const longImgUrl = productCard.querySelector('.product-list-image') ? productCard.querySelector('.product-list-image').src : productCard.outerHTML
//         const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
//         const title = productCard.querySelector(".img-options img") ? productCard.querySelector(".img-options img").alt : productCard.outerHTML
//         return {
//             title: 'abiyefon ' + title + (_opts.keyword ? (title.toLowerCase().includes(_opts.keyword) ? '' : ' ' + _opts.keyword) : ''),
//             priceNew,
//             imageUrl: imageUrlshort,
//             link,
//             timestamp: Date.now(),
//             marka: 'abiyefon',
//             subcategory: _subcategory,
//             category: _category
//         }
//     }).filter(f => f.imageUrl !== null)
// }, subcategory, category, opts)