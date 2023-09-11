
const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')



async function handler(page,context) {
    const { request: { userData: { start,title } } } = context
    const requestQueue = await RequestQueue.open();

    const url = await page.url()
    let i =0

    if(start){
   
        debugger
        const links = await page.evaluate(()=>Array.from( document.querySelectorAll('header a')).map(m=>{return {href:m.href,title:m.innerText.replaceAll('\n','').trim(),list:m.getAttribute('data-category') }}).filter(f=>f.href.includes('https://www.defacto.com.tr/') && f.list===null) ) 
        const linksToRemove =[
        // 'https://www.defacto.com.tr/kadin',
        // 'https://www.defacto.com.tr/erkek',
        // 'https://www.defacto.com.tr/cocuk',
        // 'https://www.defacto.com.tr/bebek',
        // 'https://www.defacto.com.tr/kadin-giyim',
        // 'https://www.defacto.com.tr/erkek',
        // 'https://www.defacto.com.tr/kiz-cocuk-genc-kiz',
        // 'https://www.defacto.com.tr/erkek-cocuk-genc-erkek',
        'https://www.defacto.com.tr/tum-urunler',
        'https://www.defacto.com.tr/Customer/CustomerMobileMenu',
        'https://www.defacto.com.tr/statik/gizlilik-politikasi',
        'https://www.defacto.com.tr/customer/cookiesetting',
        'https://www.defacto.com.tr/statik/gizlilik-politikasi',
        'https://www.defacto.com.tr/kurumsal/iletisim',
        'https://www.defacto.com.tr/magazalar',
        'https://www.defacto.com.tr/statik/islem-rehberi',
        'https://www.defacto.com.tr/giftclub/sikca-sorulan-sorular',
        'https://www.defacto.com.tr/statik/iade-degisim-islemleri',
        'https://www.defacto.com.tr/statik/siparis-takip',
        'https://www.defacto.com.tr/blog',
        'https://www.defacto.com.tr/Login/Logout',
        'https://www.defacto.com.tr/Customer/Account',
        'https://www.defacto.com.tr/Login?newUser=True&ReturnUrl=%2F',
        'https://www.defacto.com.tr/okula-donus',
        'https://www.defacto.com.tr/giftclub,',
        'https://www.defacto.com.tr/param-odeme-yontemi',
        'https://www.defacto.com.tr/papara-odeme-yontemi',
        'https://www.defacto.com.tr/nays-odeme-yontemi',
        'https://www.defacto.com.tr/hepsipay-odeme-yontemi',
        'https://www.defacto.com.tr/statik/sikca-sorulan-sorular',
        'https://www.defacto.com.tr/ziyaretci/siparisler',
        'https://www.defacto.com.tr/Login?returnUrl=%2Fcustomer%2Faddress',
        "https://www.defacto.com.tr/Login/FacebookLogin?returnurl=%2Fcustomer%2Fnewsletter",
        "https://www.defacto.com.tr/Login/FacebookLogin?returnurl=%2Fcustomer%2Fmyreview"

    ]
    debugger
          //  console.log('links',links)
        
            for(let l of links){
                const notMct = linksToRemove.find(f=> f===l.href)
                debugger
                if(linksToRemove.find(f=> f===l.href)===undefined ){
                    i =i+1
    
                  await  requestQueue.addRequest({url:l.href,  userData:{start:true,title:l.title} })
                      
               }
  
            }
      
        }
        const productPage = await page.$('.catalog-products')
        if(productPage){
            const hrefText =title ? title:""
            const docTitle  = await page.evaluate(()=>document.title)
            const link = await page.evaluate(()=>document.baseURI)
            const id = generateUniqueKey({hrefText,docTitle,link})
            if(start){
                const pageDataset = await Dataset.open(`pageInfo`);
                await pageDataset.pushData({hrefText,docTitle,link,objectID:id,brand:'defacto'})
                
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
            console.log( '[]:', url)
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