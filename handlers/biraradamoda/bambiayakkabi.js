

async function extractor(page) {




  //  await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {
try {
    const imageUrl = document.querySelector('.productImage a img').getAttribute('data-original')
    const title = document.querySelector('.productImage a').getAttribute('title')
    const priceNew = document.querySelector('.discountPrice').innerText.replace('₺','').trim()
    const link = document.querySelector('.productImage a').href
  
 
    return {
        title: 'bambiayakkabi ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'bambiayakkabi',
    }
} catch (error) {
    return {error,content:document.innerHTML}
}
           
        })
    })
return data
}
async function autoScroll(page) {
    await page.evaluate(async () => {

const totalItems =parseInt(document.querySelector(".FiltrelemeUrunAdet").innerText.replace(/[^\d]/gi,''))
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                const collectedItems =document.querySelectorAll(".productItem").length
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (collectedItems===totalItems) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


const productPageSelector='.FiltrelemeUrunAdet'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.bambiayakkabi.com.tr/'
const exclude=[]
const postFix =''
async function getUrls(page) {
     const url = await page.url()
    const nextPage= await page.$('li.appliedFilter span')
    const pageUrls = []
    let productCount =0
    if(nextPage){
        productCount =await page.evaluate(()=>parseInt( document.querySelector('li.appliedFilter span').innerText.replace(/[^\d]/g,'')))
        const totalPages = Math.ceil(productCount / 20)
    
       if (totalPages > 1) {
           let pagesLeft = totalPages
           for (let i = 2; i <= totalPages; i++) {
   
               pageUrls.push(`${url}?sayfa=` + i)
               --pagesLeft
   
   
           }
    }
   
    }


    return { pageUrls, productCount: 0, pageLength:0 }
}

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

