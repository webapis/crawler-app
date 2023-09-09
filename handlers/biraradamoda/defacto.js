
const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')



async function handler(page,context) {
    const { request: { userData: { start,title } } } = context
    const requestQueue = await RequestQueue.open();

    const url = await page.url()
    let i =0

    if(start){
 
        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('a')).map(m=>{return {href:m.href,title:m.innerText.replaceAll('\n','').trim()}}).filter(f=>f.href.includes('https://www.defacto.com.tr/')) ) 
         
            console.log('links',links)
        
            for(let l of links){
            
                i =i+1
    
            //    await  requestQueue.addRequest({url:l.href,  userData:{start:true,title:l.title} })
              
            }
      
        }
        const productPage = await page.$('.catalog-products')
        if(productPage){
            const hrefText =title
            const docTitle  = await page.evaluate(()=>document.title)
            const link = await page.evaluate(()=>document.baseURI)
            const id = generateUniqueKey({hrefText,docTitle,link})
            if(start){
                const pageDataset = await Dataset.open(`pageInfo`);
                await pageDataset.pushData({hrefText,docTitle,link,id})
                
            }
           
            const data = await page.$$eval('.catalog-products .product-card', (productCards) => {
                return productCards.map( productCard => {
                    try {
                        const imageUrl = productCard.querySelector('.catalog-products .product-card .product-card__image .image-box .product-card__image--item.swiper-slide img').getAttribute('data-srcset')
                        const title = productCard.querySelector('.product-card__title a').getAttribute('title').trim()
                        const priceNew = productCard.querySelector('.product-card__price--new') && productCard.querySelector('.product-card__price--new').textContent.trim().replace('₺', '').replace('TL', '')
                        const longlink = productCard.querySelector('.catalog-products .product-card .product-card__image .image-box a').href
                        const link = longlink.substring(longlink.indexOf("defacto.com.tr/") + 15)
                        const longImgUrl = imageUrl && 'https:' + imageUrl.substring(imageUrl.lastIndexOf('//'), imageUrl.lastIndexOf('.jpg') + 4)
                        const imageUrlshort = imageUrl && longImgUrl.substring(longImgUrl.indexOf("https://dfcdn.defacto.com.tr/") + 29)
            
                        return {
                            title: 'defacto ' + title.replace(/İ/g,'i').toLowerCase(),
                            priceNew,
                            imageUrl: imageUrlshort,
                            link,
                            timestamp: Date.now(),
                            marka: 'defacto',
                        }  
                    } catch (error) {
                        return {error:error.toString(),content:productCard.innerHTML}
                    }
                }).filter(f => f.imageUrl !== null && f.title.length > 5)
            })

            const withId = data.map((m)=>{
              
                const prodId = generateUniqueKey({imageUrl:m.imageUrl,marka:m.marka,link:m.link})
         
                return {...m,id:prodId,pid:id}
            })
 

            console.log('data length_____', data.length, 'url:', url)
           
            return withId
        } else{

                return[]
            }
 
debugger

  
}

async function getUrls(page) {
    const url = await page.url()
   const nextPage = await page.$('.catalog__meta--product-count span')
   const pageUrls = []
   let productCount = 0
   if(nextPage){
     productCount = await page.$eval('.catalog__meta--product-count span', element => parseInt(element.innerHTML))
    const totalPages = Math.ceil(productCount / 60)


    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }
   }
  

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }