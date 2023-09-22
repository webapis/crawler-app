const fetch =require('node-fetch')

const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
     productPageSelector:'.catalog',
     linkSelector:'#sitemap a',
     linksToRemove:[],
     hostname:'https://shop.mango.com/',
     exclude:[],
     postFix:''
}



async function extractor(page) {
    const url =await page.url()
    debugger;
    const {isoCode,idShop,family,idSection,columnsPerRow,optionalParams:{idSubSection}} = await page.evaluate(()=>{
        return window.viewObjectsJson['catalogParameters']
    })
    const params = await page.evaluate(()=>{
        return window.viewObjectsJson['catalogParameters']
    })
debugger
const productUrl = `https://shop.mango.com/services/productlist/products/${isoCode}/${idShop}/${idSection}/?pageNum=1&rowsPerPage=1000&columnsPerRow=4`
debugger
    const response =await fetch(productUrl)
debugger
const jsonData =await response.json()
debugger

const data = Object.values( jsonData.groups[0].garments).map(m=>m.colors).flat().map(m=>{
    
    const imageUrl=m.images[0].img1Src
    return {
    imageUrl:imageUrl.substring(imageUrl),
    title:'mango '+m.images[0].
    altText,
    priceNew:m.price. salePriceNoCurrency,
    link: "https://shop.mango.com/"+ m.linkAnchor.substring(1),

    timestamp: Date.now(),
    marka: 'mango',
}})
debugger
return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { extractor, getUrls,...initValues }
