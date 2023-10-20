

const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')


async function commonHandler({page,context}){
    const { request: { userData: { start,title,order,total,marka } } } = context

    const {  getUrls,productPageSelector } = require(`./${marka}`);
    const { pageUrls } = await getUrls(page)
    const requestQueue = await RequestQueue.open();
    const productsDataset = await Dataset.open(`products`);
    // if (start) {
    //     let order = 1
    //     let pageCounter =0
    //     let pagesToCollect = calculatePagePercentage(pageUrls.length,5)
    //     for (let url of pageUrls) {
                
    //             pageCounter= pageCounter+1
    //             if(pageCounter<= pagesToCollect){
    //                 if (pageUrls.length === order) {
    //                     requestQueue.addRequest({ url, userData: { start: false, opts, } })
    //                 } else {
    //                     requestQueue.addRequest({ url, userData: { start: false, opts, } })
    //                 }
    //             }
           
    //         ++order;
    //     }
    // }

  
 
    let extractor; 

    try {
    
      extractor = require(`./${marka}`).extractor;
      debugger
    } catch (error) {
      console.error(`Error importing extractor for ${marka}:`, error);
    }


    const url = await page.url()
    const info = await requestQueue.getInfo()
    console.log('info',info)
    console.log('started url',order, 'of',total,url)
    let i =0

        const productPage = await page.$(productPageSelector)
   
        if(productPage){
            const hrefText =title ? title:""
            const docTitle  = await page.evaluate(()=>document.title)
            const link = await page.evaluate(()=>document.baseURI)
            const id = generateUniqueKey({hrefText,docTitle,link})
   
            const domainName = await page.evaluate(() => document.domain);
         
            const data = await extractor(page, context)
            const images = data.map(m=> {return {url:m.imageUrl}}).filter((f,i)=>i<=7)
            debugger
      
 debugger

            console.log('data length_____', data.length, 'url:', url)
            if(start){
                if(data.length>0){
                    const pageDataset = await Dataset.open(`pageInfo`);
                    await pageDataset.pushData({hrefText,docTitle,link,objectID:id,brand:marka,domainName,images  })
                }
             
            }
           
            if (data.length>0){

                await productsDataset.pushData(data)
            }


        } else{
            console.log( '[]:', url)
                return[]
            }
 


}

function calculatePagePercentage(totalPages, percent) {
    return (percent / 100) * totalPages;
  }


module.exports={commonHandler}