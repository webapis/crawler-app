

const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')
const marka =process.env.marka

async function commonHandler({page,context,productPageSelector, linkSelector, linksToRemove, hostname}){
    const { request: { userData: { start,title } } } = context
    const requestQueue = await RequestQueue.open();
 
    let extractor; // Define extractor function

    try {
      // Dynamically import the extractor based on the marka variable
      extractor = require(`./${marka}`).extractor;
    } catch (error) {
      console.error(`Error importing extractor for ${marka}:`, error);
    }


    const url = await page.url()
    let i =0

    if(start){
   
        debugger
        const links = await page.evaluate((linkSelector)=>Array.from( document.querySelectorAll(linkSelector,hostname)).map(m=>{return {href:m.href,title:m.innerText.replaceAll('\n','').trim()}}).filter(f=>f.href.includes(hostname)),linkSelector,hostname ) 

            for(let l of links){
             
                if(linksToRemove.find(f=> f===l.href)===undefined ){
                    i =i+1
    
             await  requestQueue.addRequest({url:l.href,  userData:{start:true,title:l.title} })
                      
               }
  
            }
      
        }
        const productPage = await page.$(productPageSelector)
        if(productPage){
            const hrefText =title ? title:""
            const docTitle  = await page.evaluate(()=>document.title)
            const link = await page.evaluate(()=>document.baseURI)
            const id = generateUniqueKey({hrefText,docTitle,link})
      
           
            const data = await extractor(page, marka)

            const withId = data.map((m)=>{
              
                const prodId = generateUniqueKey({imageUrl:m.imageUrl,marka:m.marka,link:m.link})
         
                return {...m,id:prodId,pid:id}
            })
 

            console.log('data length_____', data.length, 'url:', url)
            if(start){
                const pageDataset = await Dataset.open(`pageInfo`);
                await pageDataset.pushData({hrefText,docTitle,link,objectID:id,brand:marka ,imageUrl:data[0].imageUrl})
            }
            return withId
        } else{
            console.log( '[]:', url)
                return[]
            }
 
debugger

}



module.exports={commonHandler}