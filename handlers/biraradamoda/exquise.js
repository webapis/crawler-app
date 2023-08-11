
async function handler(page, context) {

    debugger;
    const url = await page.url()

    await page.waitForSelector('.infinite-scroll-component__outerdiv')

    await autoScroll(page)
    debugger;


    const data = await page.$$eval('article', (productCards) => {
        try {
            return productCards.map(document => {
                const color=document.querySelector('a h3 ~ span').innerText
                const title = document.querySelector('a h3').innerText
                const img = document.querySelector('a picture source').getAttribute('srcset')
               // const img = document.querySelector('[srcset]') && document.querySelector('[srcset]').getAttribute('srcset').split(',').reverse()[0].trim()
                const link = document.querySelector('a').href
                const priceNew = Array.from(document.querySelector('a h3').previousSibling.childNodes).reverse()[0].innerHTML.replace('₺','').trim()
                return {
                    title: 'exquise ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-', ' ') + color,
                    priceNew: priceNew.replace('₺', ''),//.replace(',','.'),
                    imageUrl: img,// && img.substring(img.indexOf('https://cdn.myikas.com/') + 23),
                    link: link.substring(link.indexOf('https://exquise.com/') + 20),
                    timestamp: Date.now(),
                    marka: 'exquise',
    
                }
            })  
        } catch (error) {
            return {error:error.toString(),content:document.content}
        }
    
    })
    console.log('data length_____', data.length, 'url:', url)
    debugger

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}


async function autoScroll(page) {
    page.on("console", (message) => {
      console.log("Message from Puppeteer page:", message.text());
    });
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        let inc = 0;
  
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
  
          window.scrollBy(0, distance);
          totalHeight += distance;
          inc = inc + 1;
          console.log("inc", inc);
          if (totalHeight >= scrollHeight - window.innerHeight) {
            if (inc === 50) {
              clearInterval(timer);
              resolve();
            }
          } else {
            inc = 0;
          }
        }, 500);
      });
    });
  }


// async function autoScroll(page) {
//     await page.evaluate(async () => {


//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             let inc = 0
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;
//                 const items = document.querySelectorAll('[data-id]').length
//                 const total = parseInt(document.querySelector('div[class^="style_productCount"]').innerText.replace(/[^\d]/g, ''))

//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 inc = inc + 1
//                 if (items >= total) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 200);
//         });
//     });
// }
async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
