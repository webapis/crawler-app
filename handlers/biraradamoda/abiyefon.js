const initValues ={
    productPageSelector:'.products',
    linkSelector:'#topMainMenu a',
    linksToRemove:[],
    hostname:'https://www.abiyefon.com/',
     exclude:['USD','EUR','GBP','&uzunluk=uzun&uzunluk=uzun&'],
     postFix :'?currency=TL'
}
const  extractor=async (page)=> {


    const data = await page.$$eval('.products .product-link', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector("span[data-price]").innerHTML
                const link = document.href
    
                const imageUrl = document.querySelector('img.product-list-image').src
               
                const title = document.querySelector('img.product-list-image').alt
                return {
                    title:'abiyefon ' + title.toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka:'abiyefon'
                }  
            }
            catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
        })
    })
debugger
 return data
}



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

module.exports = { extractor, getUrls,...initValues }




















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