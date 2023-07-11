
async function handler(page) {
    debugger;
    const url = await page.url();
  
    await page.waitForSelector(".catalogWrapper");
    debugger;
    //   await page.click('span.bskico-filter')
    await autoScroll(page);
    debugger;
  
    const data = await page.$$eval(".catalogWrapper .productItem", (productCards) => {
      return productCards.map((document) => {
        try {
            const title = document.querySelector('.detailLink img').alt
            const imageUrl=document.querySelector('.detailLink picture source[media="(max-width:1000px)"]').getAttribute('data-srcset')
            const link=document.querySelector('.detailLink').href
            const priceNew=document.querySelector('.currentPrice').innerText.replace("TL",'').trim()
          return {
                      title: 'manuka ' + title.replace(/İ/g,'i').toLowerCase(),
                      priceNew,
                      imageUrl: imageUrl.substring(imageUrl.indexOf("https://cache.manuka.com.tr/")+28),
                      link:link.substring(link.indexOf("https://www.manuka.com.tr/")+26),
                      timestamp: Date.now(),
                      marka: 'manuka',
          };
        } catch (error) {
          return { error: error.toString(), content: document.innerHTML };
        }
      });
    })
    debugger;
    console.log("data length_____", data.length, "url:", url, process.env.GENDER);
  
    console.log("process.env.GENDER ");
    const formatprice = data.map((m) => {
      return { ...m, title: m.title + " _" + process.env.GENDER };
    }).filter(f=>!f.error);
  
    return formatprice;
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
            if (inc === 300) {
              clearInterval(timer);
              resolve();
            }
          } else {
            inc = 0;
          }
        }, 50);
      });
    });
  }
  async function getUrls(page) {
    const pageUrls = [];
  
    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
  }
  module.exports = { handler, getUrls };

// async function handler(page, context) {



//     const url = await page.url()

//     await page.waitForSelector('span.forDesktop')
//     let elem = await page.$('span.forDesktop')
//     await elem.hover()
//     await page.click('li span[value="tr"]')
//     await page.waitForNavigation()
//     await page.waitForSelector('img[alt="Türkçe"]')
//     // const language =await page.evaluate(()=>document.querySelector('span.forDesktop').innerHTML)
//     // if(language==='English - EUR'){
//     //      let elem = await page.$('span.forDesktop')
//     //      await elem.hover()
//     //      await page.click('span[value="tr"]')
//     //     
//     // }

//     debugger
//     await page.waitForSelector('.fl.col-12.catalogWrapper')
//     const products = await page.evaluate(() => window.PRODUCT_DATA)
//     debugger
//     debugger;

//     const data = products.map(product => {

//         const longImage = product.image
//         const title = product.name.replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase()
//         const priceNew = product.total_sale_price//.toString()
//         const link = product.url

//         return {
//             title: 'manuka ' + title.replace(/İ/g,'i').toLowerCase().split(' ').map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' ')+" _"+process.env.GENDER,
//             priceNew,
//             imageUrl: longImage.substring(longImage.indexOf('https://www.manuka.com.tr') + 25),
//             link,
//             timestamp: Date.now(),
//             marka: 'manuka',

//         }
//     })


//     console.log('data length_____', data.length, 'url:', url)




//     return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
// }

// async function getUrls(page) {
//     debugger
//     const url = await page.url()
//     await page.waitForSelector('.totalProduct')

//     const productCount = await page.$eval('.totalProduct', element => parseInt(element.innerHTML.replace(/[^\d]/g, '')))
//     const totalPages = Math.ceil(productCount / 12)
//     const pageUrls = []

//     let pagesLeft = totalPages
//     for (let i = 2; i <= totalPages; i++) {



//         pageUrls.push(`${url}?pg=` + i)
//         --pagesLeft


//     }

//     return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
// }
// module.exports = { handler, getUrls }