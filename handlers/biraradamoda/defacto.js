





  const  extractor=async (page,marka)=> {
    const data = await page.$$eval('.catalog-products .product-card', (productCards,marka) => {
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
                    title: marka+' ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka,
                }  
            } catch (error) {
                return {error:error.toString(),content:productCard.innerHTML}
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    },marka)
  return data
}
const productPageSelector='.catalog-products'
const linkSelector='.page-body-content-sitemap a'
const linksToRemove=[

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
const hostname='https://www.defacto.com.tr/'
const productItemsSelector='.catalog-products .product-card'
const exclude=[]
const postFix =''
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
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix }