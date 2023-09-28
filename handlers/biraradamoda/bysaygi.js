


const initValues ={
  productPageSelector:'.appliedFilter.FiltrelemeUrunAdet span',
  linkSelector:'.navigation a',
  linksToRemove:[],
  hostname:'https://www.bysaygi.com/',
  exclude:[],
  postFix:'?currency=try'
}
async function extractor(page) {

    const url = await page.url()
    const data = await page.$$eval('.productItem', (productCards,url) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector('.discountPrice span').textContent.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
                const link = document.querySelector('.detailLink').href
                const imageUrl =  document.querySelector('img[data-original]')&& document.querySelector('img[data-original]').getAttribute('data-original')
                const title = document.querySelector('.detailLink').getAttribute('title')
    
                return {
                    title: 'bysaygi ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'bysaygi',
    
                }  
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
       
        })
    },url)


    return data
}









async function getUrls(page) {


    const url = await page.url()
 const nextPage =   await page.$('.FiltrelemeUrunAdet')

 let productCount =0
    const pageUrls = []

 if(nextPage){
     productCount = await page.evaluate(() => parseInt(document.querySelector('.FiltrelemeUrunAdet span').innerHTML.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 99)
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?sayfa=` + i )
     
    }
 }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
