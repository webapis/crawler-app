

async function handler(page, context) {

    const url = await page.url()
    await page.waitForSelector('.appliedFilter.FiltrelemeUrunAdet span')
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector('.discountPrice span').textContent.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
                const longlink = document.querySelector('.detailLink').href
                const link = longlink.substring(longlink.indexOf("https://www.bysaygi.com/") + 24)
                const longImgUrl =  document.querySelector('img[data-original]')&& document.querySelector('img[data-original]').getAttribute('data-original')
                //const imageUrlshort = longImgUrl&& longImgUrl.substring(longImgUrl.indexOf('https://www.quzu.com.tr/') + 24)
                const title = productCard.querySelector('.detailLink').getAttribute('title')
    
                return {
                    title: 'saygigiyim ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,//:priceNew.replace('.','').replace(',','.').trim(),
                    imageUrl: longImgUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'saygigiyim',
    
                }  
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
       
        }).filter(f => f.imageUrl !== null)
    })


    console.log('data length_____', data.length, 'url:', url)

    debugger
    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}


// async function handler(page, context) {
//     const { request: { userData: {  } } } = context

//     const url = await page.url()


//     // onetrust-accept-btn-handler
//     const productExist = await page.$('.appliedFilter.FiltrelemeUrunAdet span')
//     debugger
//     const acceptcookies = await page.$('.seg-popup-close')
//     if (acceptcookies) {
//         await page.click('.seg-popup-close')
//     }
//     if (productExist) {
//         return new Promise((resolve, reject) => {
//             try {
//                 let totalProducts = 0
//                 let collected = 0
//                 let inv = setInterval(async () => {



//                     console.log('collected', collected,totalProducts)

//                     if (totalProducts>0 && totalProducts === collected) {
//                               clearInterval(inv)

//                               const data = await page.$$eval('.productItem', (productCards) => {
//                                 return productCards.map(productCard => {
//                                     const priceNew = productCard.querySelector('.discountPrice span').textContent.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
//                                     const longlink = productCard.querySelector('.detailLink').href
//                                     const link = longlink.substring(longlink.indexOf("https://www.bysaygi.com/") + 24)
//                                     const longImgUrl = productCard.querySelector('img[data-original]') && productCard.querySelector('img[data-original]').getAttribute('data-original')
//                                     //const imageUrlshort = longImgUrl&& longImgUrl.substring(longImgUrl.indexOf('https://www.quzu.com.tr/') + 24)
//                                     const title = productCard.querySelector('.detailLink').getAttribute('title')

//                                     return {
//                                         title: 'saygigiyim ' + title.replace(/İ/g, 'i').toLowerCase(),
//                                         priceNew,//:priceNew.replace('.','').replace(',','.').trim(),
//                                         imageUrl: longImgUrl,
//                                         link,
//                                         timestamp: Date.now(),
//                                         marka: 'saygigiyim',

//                                     }
//                                 }).filter(f => f.imageUrl !== null)
//                             })

//                             debugger
//                             console.log('data length_____', data.length, 'url:', url)
//                             debugger

//                             const remap =data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
//                             return resolve(remap)
//                         //  await page.click('.button.js-load-more')


//                     } else {

//                         await manualScroll(page)
//                         totalProducts = await page.evaluate(() => parseInt(document.querySelector('.appliedFilter.FiltrelemeUrunAdet span').innerHTML.replace(/[^\d]/g, '')))
//                         collected = await page.evaluate(() => document.querySelectorAll('#ProductPageProductList .productItem').length)

//                     }

//                 }, 50)
//                 // clearInterval(inv)
//             } catch (error) {
//                 console.log('error------',error)
//                 debugger
//                 return reject(error)
//             }
//         })
//     } else {
//         console.log('no product')
//         return []
//     }



// }





async function manualScroll(page) {
    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 100;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });
}

async function getUrls(page) {


    const url = await page.url()
    await page.waitForSelector('.FiltrelemeUrunAdet')

    const productCount = await page.evaluate(() => parseInt(document.querySelector('.FiltrelemeUrunAdet span').innerHTML.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 99)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?sayfa=` + i )
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }