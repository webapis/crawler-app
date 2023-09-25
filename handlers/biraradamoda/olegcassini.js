
//const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.productItem',
    linkSelector:'.nav-links a',
    linksToRemove:[],
    hostname:'https://www.olegcassini.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    const url = await page.url()

                              const data = await page.$$eval('.productItem', (productCards) => {

                                try {
                                    return productCards.map(document => {
                                        const priceNew = document.querySelector('.currentPrice').innerHTML.replace('TL', '').replace(/\n/g,'')
                                        const link = document.querySelector('.proRowName a[title]').href
                                   
                                         const imageUrl = document.querySelector('[srcset]').getAttribute('srcset').split(',')[10].trim().split(' ')[0]
                            
                                        const title = document.querySelector('.proRowName a[title]').getAttribute('title')
                                        return {
                                            title: 'olegcassini ' + title.replace(/İ/g,'i').toLowerCase(),
                                            priceNew,
                                            imageUrl,
                                            link,
                                            timestamp: Date.now(),
                                            marka: 'olegcassini',
                            
                            
                            
                                        }
                                    })     
                                } catch (error) {
                                    return {error:error.toString(),url,content:document.innerHTML}
                                }

                            })
return data

                    
}





async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}



async function manualScroll(page) {
    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 200;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });
}

module.exports = { extractor, getUrls,...initValues }