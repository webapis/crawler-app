
const {  RequestQueue } =require('crawlee');
async function handler(page, context) {
    const { request:{userData:{ start, detailPage}}  } = context
    const url = await page.url()
    const requestQueue = await RequestQueue.open();
debugger
    if (start) {
    debugger
        await page.waitForSelector('.result.-only-desktop')
        const productCount = await page.$eval('.result.-only-desktop', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
       debugger
  const scroll=  await   autoScroll(page)
  debugger
       console.log('scroll',scroll)
        // const totalPages = Math.ceil(productCount / 59)
        // const pageUrls = []

        // let pagesLeft = totalPages
        // for (let i = 1; i <= totalPages; i++) {


        //     if (pagesLeft > 0) {

        //         pageUrls.push(`${url}?page=` + i)
        //        await requestQueue.addRequest({ url:`${url}?page=` + i, userData:{ start: false}  })
        //         --pagesLeft
        //     }

        // }
        await page.waitForSelector('.list__products')
        const data = await page.evaluate(() => {
            const productCards = Array.from(document.querySelectorAll('.js-product-wrapper.product-item'))
            return productCards.map(productCard => {
                const longLink = productCard.querySelector('.js-product-wrapper.product-item a').href
                return {
                    link: longLink,
                }
            })
        })
        for (let url of data) {
           await requestQueue.addRequest({ url:url.link, userData:{ start: false,detailPage: true}  })
        }
debugger
        return []
    }



    if (detailPage) {
        try {
            debugger
            await page.waitForSelector('.product-media__slider img')
            debugger
                    const data = await page.evaluate(() => {
                            const imageUrl =document.querySelector('.product-media__slider img').src
                        return [{
                            title: 'koton ' + document.querySelector('.product-info__header-title').innerText.toLowerCase() + ' ' + document.querySelector('.pz-variant__selected').innerText.substring(6),
                            priceNew: document.querySelector('pz-price').innerText.replace('TL', '').trim(),//: newPrice.replace(',', '.').trim(),
                            imageUrl:imageUrl.substring(imageUrl.indexOf('https://ktnimg2.mncdn.com/')+26) ,
                            link: location.href.substring(location.href.indexOf('https://www.koton.com/')+22),
                            timestamp: Date.now(),
                            marka: 'koton',
                        }]
                    })
            debugger
                    console.log('data length_____', data.length, 'url:', url)
                    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
        } catch (error) {
            debugger

            return error
        }
debugger





    }
}



async function autoScroll(page) {
    await page.evaluate(async () => {
        const totalItems = parseInt(document.querySelector('.result.-only-desktop').textContent.replace(/[^\d]/g, '').trim())


   return      await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
    
                const totalCollected = document.querySelectorAll('.product-item').length
          
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalCollected === totalItems) {
                    window.scrollBy(0, distance);
             
                    clearInterval(timer);
                    resolve({totalCollected,totalItems});
                }
            }, 200);
        });
    });
}
async function getUrls(page) {

    const url = await page.url()
    // await page.waitForSelector('.result.-only-desktop')
    // const productCount = await page.$eval('.result.-only-desktop', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
    // const totalPages = Math.ceil(productCount / 59)
     const pageUrls = []

    // let pagesLeft = totalPages
    // for (let i = 1; i <= totalPages; i++) {


    //     if (pagesLeft > 0) {

    //         pageUrls.push(`${url}?page=` + i)
    //         --pagesLeft
    //     }

    // }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }

}
module.exports = { handler, getUrls }


/*
async function getUrls(page) {

    await page.waitForSelector('.plt-count')
    const productCount = await page.$eval('.plt-count', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
    debugger;
    const withMultipage = await page.$('.pagingBar .paging')
    if (withMultipage) {

        const urls = await page.evaluate(() => {
            const arr = Array.from(document.querySelector('.pagingBar .paging').querySelectorAll('a')).map(t => t.href)
            const remdub = arr.filter(function (item, pos) {
                return arr.indexOf(item) == pos;
            })
            const lastURL = remdub[remdub.length - 1]
            const lastPage = parseInt(lastURL.substring(lastURL.lastIndexOf('=') + 1))
            const totalPages = lastPage
            const pageUrls = []
            const urlTemplate = lastURL.substring(0, lastURL.lastIndexOf('=') + 1)
            let pagesLeft = totalPages
            for (let i = 1; i <= totalPages; i++) {

                if (pagesLeft > 0) {
                    pageUrls.push(`${urlTemplate}` + i)
                    --pagesLeft
                }
            }

            return pageUrls
        })
        return { pageUrls: urls, productCount, pageLength: urls.length + 1 }
    } else
        return { pageUrls: [], productCount, pageLength: 1 }

}
module.exports = { handler, getUrls }
*/