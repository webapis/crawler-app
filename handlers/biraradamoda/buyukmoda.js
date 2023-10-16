

const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {
    await autoScroll(page);
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector('.LastFiyat.liste-LastFiyat')?document.querySelector('.LastFiyat.liste-LastFiyat').innerHTML: document.querySelector('.product-price').innerText
                const link = document.querySelector('.urunresmi a').href
              
                const imageUrl = document.querySelector('img.ndImage').src

                const title = document.querySelector('[itemprop=name]').getAttribute('content')
                return {
                    title: 'buyukmoda ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka:'buyukmoda',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
  
        })
        
    })

return data

}


const productPageSelector='.catalogWrapper'



async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { extractor, getUrls,productPageSelector }

