
//const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {
    
     //   await autoScroll(page)
debugger
        const data = await page.$$eval('.product-item', (productCards) => {
            return productCards.map(productCard => {
                try {
                    const priceNew = productCard.querySelector('.price.regular') ? productCard.querySelector('.price.regular').innerHTML.replace('TL', '').trim() : ''
                    const link = productCard.querySelector('.item-heading a') ? productCard.querySelector('.item-heading a').href : ''
                    const imageUrl = 'https:'+ productCard.querySelector('[data-src]').getAttribute('data-src')
                    const title = productCard.querySelector('.item-heading a') ? productCard.querySelector('.item-heading a').textContent.replace(/[\n]/g, '').trim() : ''
    
                    return {
                        title: 'hm ' + title.replace(/İ/g, 'i').toLowerCase(),
                        priceNew: priceNew.replace('&nbsp;', '.'),
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'hm',
                    }
                } catch (error) {
                    return {
                        error:error.toString(),content:document.innerHTML
                    }
                }
            
            })
        })
   
debugger
        return data




    

}




async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                var toth = 7775
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

async function getUrls(page) {


  const nextPage = await page.$('.load-more-heading')

    const pageUrls = []
    if(nextPage){
        const start = await page.evaluate(()=>parseInt( document.querySelector('.load-more-heading').innerText.split(' ').filter(Number)[0]))
        const total = await page.evaluate(()=>parseInt( document.querySelector('.load-more-heading').innerText.split(' ').filter(Number)[0]))
        
        if(start<total){
            pageUrls.push(`${url}??sort=stock&image-size=small&image=model&offset=0&page-size=` + productCount)
        }

        
    
    }



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.products-listing'
const linkSelector='nav a'
const linksToRemove=['https://www2.hm.com/tr_tr/customer-service/newsletter.html',
'https://www2.hm.com/tr_tr/customer-service/shopping-at-hm/store-locator','https://www2.hm.com/tr_tr/cart','https://www2.hm.com/tr_tr/favourites','https://www2.hm.com/tr_tr/kadin.html']
const hostname='https://www2.hm.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

