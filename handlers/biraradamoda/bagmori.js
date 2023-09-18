


async function extractor(page) {


    await page.waitForSelector('.ProductList',{timeout:180000})
  // const totalProducts= await page.evaluate(()=>parseInt(document.querySelector("[for^=sidebar-filter-p-product_type]").innerText.replace(/[^\d]/g,"")))
    await autoScroll(page);

    debugger
    const data = await page.$$eval('.ProductItem', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector('.ProductItem__Price').innerText.replace('TL','')
                const longlink = document.querySelector(".ProductItem__Title.Heading a").href
                 const link = longlink.substring(longlink.indexOf("https://www.bagmori.com/") + 24)
                const longImgUrl =document.querySelector('.ProductItem__Image').getAttribute('data-src').replace('{width}',600)
                 const imageUrlshort = longImgUrl.substr(longImgUrl.indexOf("//www.bagmori.com/") + 18)//https://cdn3.sorsware.com/
                const title = document.querySelector(".ProductItem__Title.Heading a").innerText
                return {
                    title: 'bagmori ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'bagmori',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
        
        })
    })





    return data.filter(f=>f.priceNew !=="")
}


async function getUrls(page) {


   // const nextPage =     await page.$('.Pagination__Nav a')
    const pageUrls = []
    // if(nextPage){
    //     const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.Pagination__Nav a')).map(m=>m.innerText).filter(Number)))

    //     let pagesLeft = totalPages
    //     for (let i = 2; i <= totalPages; i++) {
    
    //         pageUrls.push(`https://www.bagmori.com/search?options%5Bprefix%5D=last&page=${i}&q=Canta&type=product`)
    //         --pagesLeft
    
    //     }
    // }
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}


const productPageSelector='.ProductList'
const linkSelector='nav.Header__MainNav a'
const linksToRemove=[]
const hostname='https://www.bagmori.com/'
const exclude=[]
const postFix =''


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
        }, 200);
      });
    });
  }
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

