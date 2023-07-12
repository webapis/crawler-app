const {  RequestQueue ,Dataset} =require('crawlee');
async function handler(page,context) {
const {request:{userData:{start}}}=context

const requestQueue = await RequestQueue.open();
    debugger
        const url = await page.url()
    
        const pageExist = await page.$('.catalogWrapper')

        if(start){
          await page.waitForSelector('.catalogWrapper')
       await requestQueue.addRequest({url:'https://sarar.com/canta?ps=2',userData:{start:false}})
        }

        else{
     
          if(pageExist){
            const productsDataset = await Dataset.open(`products`);
            const { items: productItems } = await productsDataset.getData();
            
            var groupBy = function (xs, key) {
              return xs.reduce(function (rv, x) {
                  (rv[x[key]] = rv[x[key]] || []).push(x);
                  return rv;
              }, {});
          };
          const groupByimageUrl = groupBy(productItems, 'imageUrl')
          let similarexists =false
          for (let image in groupByimageUrl) {
              const curr = groupByimageUrl[image]
              image
              debugger
              if(curr.length>1){
                  console.log('similar images',image,': ',curr.length)
                  similarexists=true
              }
         
         
          }
          if(!similarexists){
            const lastPage = parseInt( url.substring(url.indexOf('ps=')+3))
            await requestQueue.addRequest({url:`https://sarar.com/canta?ps=${lastPage+1}`,userData:{start:false}})
          }

          }else{
        
          }

        }
        if(start  || pageExist){
          const data = await page.$$eval('.catalogWrapper .productItem', (productCards) => {
            return productCards.map(document => {
              try {
                   const imageUrl = document.querySelector('span[itemprop="image"]').getAttribute('content')
                   const title = document.querySelector('span[itemprop="name"]').getAttribute('content')
                   const priceNew = document.querySelector('.discount-in-basket-price span')? document.querySelector('.discount-in-basket-price span').innerText.replace('₺',''):document.querySelector('.currentPrice').innerText.replace('₺','').trim()
                   const link = document.querySelector('span[itemprop="url"]').getAttribute('content')

                  return {
                       title: 'sarar ' + title.replace(/İ/g,'i').toLowerCase(),
                       priceNew,
                       imageUrl,
                       link,
                       timestamp: Date.now(),
                       marka: 'sarar',
                  }
              } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
              }
             
            })//.filter(f => f.imageUrl !== null && f.title.length > 5)
        })
    debugger
        console.log('data length_____', data.length, 'url:', url,process.env.GENDER)
    
    
        console.log("process.env.GENDER ")
        // const formatprice = data.map((m) => {
        //     return { ...m, title: m.title + " _" + process.env.GENDER }
        // })
    
    
        return data
        } else{
          []
        }

   
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
    async function getUrls(page) {
        // const url = await page.url()
        // await page.waitForSelector('.catalog__meta--product-count span')
        // const productCount = await page.$eval('.catalog__meta--product-count span', element => parseInt(element.innerHTML))
        // const totalPages = Math.ceil(productCount / 60)
        const pageUrls = []
    
        // let pagesLeft = totalPages
        // for (let i = 2; i <= totalPages; i++) {
    
    
    
        //     pageUrls.push(`${url}?page=` + i)
        //     --pagesLeft
    
    
        // }
    
        return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
    }
    module.exports = { handler, getUrls }