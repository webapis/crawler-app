

const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')
const marka =process.env.marka

async function commonHandler({page,context,productPageSelector}){
    const { request: { userData: { start,title,order,total } } } = context
    const requestQueue = await RequestQueue.open();
 
    let extractor; 

    try {
    
      extractor = require(`./${marka}`).extractor;
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
            const withId = data.map((m)=>{
              
                const prodId = generateUniqueKey({imageUrl:m.imageUrl,marka:m.marka,link:m.link})
         
                return {...m,id:prodId,pid:id}
            })
 debugger

            console.log('data length_____', data.length, 'url:', url)
            if(start){
                if(data.length>0){
                    const pageDataset = await Dataset.open(`pageInfo`);
                    await pageDataset.pushData({hrefText,docTitle,link,objectID:id,brand:marka,domainName,images  })
                }
             
            }
            return withId
        } else{
            console.log( '[]:', url)
                return[]
            }
 
debugger

}



module.exports={commonHandler}