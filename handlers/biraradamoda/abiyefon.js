
const  extractor=async (page,marka)=> {


    const data = await page.$$eval('.products .product-link', (productCards,marka) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector("span[data-price]").innerHTML
                const longlink = document.href
                const link = longlink.substring(longlink.indexOf("https://www.abiyefon.com/") + 25)
                const longImgUrl = document.querySelector('img.product-list-image').src
                const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
                const title = document.querySelector('img.product-list-image').alt
                return {
                    title: marka+' ' + title.toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka
                }  
            }
            catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
        }).filter(f => f.imageUrl !== null  && f.link !==null)
    },marka)

 return data
}
 const productPageSelector='.products'
 const linkSelector='a:not(.product-link)'
 const linksToRemove=['https://www.abiyefon.com/iletisim.html'
 ,'https://www.abiyefon.com/hesabim/register',
 'https://www.abiyefon.com/hesabim/login',
 'https://www.abiyefon.com/sepetim',
 'https://www.abiyefon.com/begendiklerim',
 'https://www.abiyefon.com/hakkimizda.shtm',
 'https://www.abiyefon.com/musteri-hizmetleri.shtm',
 'https://www.abiyefon.com/teslimat-kosullari.shtm',
 'https://www.abiyefon.com/iade-kosullari',
 'https://www.abiyefon.com/sikca-sorulan-sorular',
 'https://www.abiyefon.com/yasal-uyari.shtm'

]
 const hostname='https://www.abiyefon.com/'
 const productItemsSelector='.products .product-link'
const exclude=['USD','EUR','GBP','&uzunluk=uzun&uzunluk=uzun&']
const postFix ='?currency=TL'



async function getUrls(page) {
    const url = await page.url()
    const pageExist =     await page.$('.count-info-text strong')
    let pageUrls = []
    let productCount = 0
    if(pageExist){
         productCount = await page.$eval('.count-info-text strong', element => parseInt(element.textContent))
        const totalPages = Math.ceil(productCount / 100)
    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
    
        }
    }


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix }
























// const data = await page.$$eval('.products li', (productCards, _subcategory, _category, _opts) => {
//     return productCards.map(productCard => {
//         const priceNew = productCard.querySelector("span[data-price]") ? productCard.querySelector("span[data-price]").getAttribute('data-price').replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim() : productCard.outerHTML
//         const longlink = productCard.querySelector('.product-link') ? productCard.querySelector('.product-link').getAttribute('data-purehref') : productCard.outerHTML
//         const link = longlink.substring(longlink.indexOf("/") + 1)
//         const longImgUrl = productCard.querySelector('.product-list-image') ? productCard.querySelector('.product-list-image').src : productCard.outerHTML
//         const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
//         const title = productCard.querySelector(".img-options img") ? productCard.querySelector(".img-options img").alt : productCard.outerHTML
//         return {
//             title: 'abiyefon ' + title + (_opts.keyword ? (title.toLowerCase().includes(_opts.keyword) ? '' : ' ' + _opts.keyword) : ''),
//             priceNew,
//             imageUrl: imageUrlshort,
//             link,
//             timestamp: Date.now(),
//             marka: 'abiyefon',
//             subcategory: _subcategory,
//             category: _category
//         }
//     }).filter(f => f.imageUrl !== null)
// }, subcategory, category, opts)