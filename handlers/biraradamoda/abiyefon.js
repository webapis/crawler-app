const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')

async function handler(page,context) {
    const { request: { userData: { start,title } } } = context
    const requestQueue = await RequestQueue.open();

        if(start){

        const links = await page.evaluate(()=>{
         const aTags =   document.querySelectorAll('a').filter(link => !link.classList.contains('.product-link'))
            Array.from(aTags).map(m=>{return {href:m.href,title:m.innerText.replaceAll('\n','').trim()}}).filter(f=>f.href.includes('https://www.abiyefon.com/'))
        
        
        
        } ) 
   
            for(let l of links){
            
                await  requestQueue.addRequest({url:l.href+'/?currency=TL',  userData:{start:true,title:l.title} })
          
            }
      
        }
    const url = await page.url()
   // await page.waitForSelector('.products')
    const productPage = await page.$('ul.products')
    if(productPage){
debugger
const hrefText =title ? title:""
const docTitle  = await page.evaluate(()=>document.title)
const link = await page.evaluate(()=>document.baseURI)
const id = generateUniqueKey({hrefText,docTitle,link})
   


    const data = await page.$$eval('.products .product-link', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector("span[data-price]").innerHTML
                const longlink = document.href
                const link = longlink.substring(longlink.indexOf("https://www.abiyefon.com/") + 25)
                const longImgUrl = document.querySelector('img.product-list-image').src
                const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
                const title = document.querySelector('img.product-list-image').alt
                return {
                    title: 'abiyefon ' + title.toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'abiyefon'
                }  
            }
            catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
        }).filter(f => f.imageUrl !== null  && f.link !==null)
    })

    console.log('data length_____', data.length, 'url:', url)
    const withId = data.map((m)=>{
              
        const prodId = generateUniqueKey({imageUrl:m.imageUrl,marka:m.marka,link:m.link})
 
        return {...m,id:prodId,pid:id}
    })


    console.log('data length_____', data.length, 'url:', url)
    if(start){
        const pageDataset = await Dataset.open(`pageInfo`);
        await pageDataset.pushData({hrefText,docTitle,link,objectID:id,brand:'abiyefon' ,imageUrl:data[0].imageUrl})
        
    }
    return withId
}else {
    console.log( '[]:', url)
    return []
}


}

async function getUrls(page) {
 

    return { pageUrls:[], productCount:0, pageLength:0 }
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
module.exports = { handler, getUrls }
























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