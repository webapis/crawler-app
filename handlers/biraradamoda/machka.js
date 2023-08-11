

async function handler(page, context) {

    const url = await page.url()
    await page.waitForSelector('.ems-prd-list')
    await page.waitForSelector('.ems-prd')
   
      let   data = await page.$$eval('.ems-prd', (items) => {

            return items.map(document => {

                try {
                    const priceNew = document.querySelector('.ems-prd-price-last') && document.querySelector('.ems-prd-price-last').innerText.replace('₺', '').trim()
    
                    const longlink = document.querySelector('.ems-prd-link.btn-full').href
                    const link = longlink.substring(longlink.indexOf('https://www.machka.com.tr/urun/') + 31)
                    const longImgUrl = document.querySelector('.ems-responsive-item').getAttribute('data-image-src')
                  //  const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://machka.mncdn.com/mnresize/660/-//Machka/products/') + 57)
        
                    return {
                        title: 'machka ' + document.querySelector('.ems-prd-title').innerText.replace(/İ/g,'i').toLowerCase(),
                        priceNew,//: priceNew.replace('.', '').replace(',00', '').trim(),
                        imageUrl: longImgUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'machka',
        
                    }
                } catch (error) {
                    return {error:error.toString(),context:document.innerHTML}
                }
           
            })
        });
    


    debugger

    console.log('data length_____', data.length, 'url:', url)


    debugger
    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})






}


// async function handlerdd(page, context) {
//     const { request: { userData: {  } } } = context

//     const url = await page.url()

//         return new Promise((resolve, reject) => {
//             try {
//                 let totalProducts = 0
//                 let collected = 0
//                 let inv = setInterval(async () => {

//                     console.log('collected', collected,totalProducts)

//                     if (totalProducts>0 && totalProducts === collected) {
//                               clearInterval(inv)

//                               const data = await page.$$eval('.ems-prd', (items) => {

//                                 return items.map(item => {
//                                     const priceNew = item.querySelector('.ems-prd-price-last') && item.querySelector('.ems-prd-price-last').innerText.replace('₺', '').trim()
                        
//                                     const longlink = item.querySelector('.ems-prd-link.btn-full').href
//                                     const link = longlink.substring(longlink.indexOf('https://www.machka.com.tr/urun/') + 31)
//                                     const longImgUrl = item.querySelector('.ems-responsive-item').getAttribute('data-image-src')
//                                     const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://machka.mncdn.com/mnresize/660/-//Machka/products/') + 57)
                        
//                                     return {
//                                         title: 'machka ' + item.querySelector('.ems-prd-title').innerText.replace(/İ/g,'i').toLowerCase(),
//                                         priceNew,//: priceNew.replace('.', '').replace(',00', '').trim(),
//                                         imageUrl: imageUrlshort,
//                                         link,
//                                         timestamp: Date.now(),
//                                         marka: 'machka',
                        
//                                     }
//                                 })
//                             });

//                             debugger
//                             console.log('data length_____', data.length, 'url:', url)
//                             debugger

//                             const remap =data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
//                             return resolve(remap)
//                         //  await page.click('.button.js-load-more')


//                     } else {

//                         await manualScroll(page)
//                         totalProducts = await page.evaluate(() =>parseInt(document.querySelector('.prd-qty').innerHTML.replace(/[^\d]/g,'')))
//                         collected = await page.evaluate(() => document.querySelectorAll('.ems-prd').length)

//                     }

//                 }, 150)
//                 // clearInterval(inv)
//             } catch (error) {
//                 console.log('error------',error)
//                 debugger
//                 return reject(error)
//             }
//         })
  



// }

// async function manualScroll(page) {
//     await page.evaluate(async () => {
//         var totalHeight = 0;
//         var distance = 200;
//         let inc = 0
//         window.scrollBy(0, distance);
//         totalHeight += distance;
//         inc = inc + 1
//     });
// }

async function getUrls(page) {

    const url = await page.url()
    await page.waitForSelector('.prd-qty')
    const productCount = await page.evaluate(()=>parseInt(document.querySelector('.prd-qty').innerHTML.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 15)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
