

const {  Dataset,RequestQueue } =require('crawlee');
const {generateUniqueKey} =require('../../utils/generateUniqueKey')
const marka =process.env.marka

async function commonHandler({page,context,productPageSelector, linkSelector, linksToRemove, hostname, exclude,postFix}){
    const { request: { userData: { start,title,order,total } } } = context
    const requestQueue = await RequestQueue.open();
 
    let extractor; // Define extractor function

    try {
      // Dynamically import the extractor based on the marka variable
      extractor = require(`./${marka}`).extractor;
    } catch (error) {
      console.error(`Error importing extractor for ${marka}:`, error);
    }


    const url = await page.url()
    const info = await requestQueue.getInfo()
    console.log('info',info)
    console.log('started url',order, 'of',total,url)
    let i =0

    if(start){
   
 
        const links = await page.evaluate((linkSelector,hostname)=>Array.from( document.querySelectorAll(linkSelector)).map((m,i)=>{return {href:m.href,title:m.innerText.replaceAll('\n','').trim(),order:i} }).filter(f=>f.href.includes(hostname)  ),linkSelector,hostname ) 
        const relatedLinks =filterArray(links,linksToRemove)
        console.log('links.length',relatedLinks.length)
        const linkDataset = await Dataset.open(`links`);
        await linkDataset.pushData({links:relatedLinks.map((m,i)=>{return {url:m.href,title:m.title}})})
     
            for(let l of relatedLinks ){
                let negative =false
              
                if(exclude.length>0){
                    for(let e of exclude){ 
                        if(l.href.indexOf(e) !==-1){
                         
                            negative=true
                        }
                    }
                } 
    
             if(linksToRemove.find(f=> f===l.href)===undefined && !negative && l.href.length<=150 ){
                    i =i+1
                
           await  requestQueue.addRequest({ url:l.href.replace(postFix,'') + postFix,  userData:{start:true,title:l.title,order:l.order, total:relatedLinks.length} })
                      
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
                if(data.length>0){
                    const pageDataset = await Dataset.open(`pageInfo`);
                    await pageDataset.pushData({hrefText,docTitle,link,objectID:id,brand:marka ,imageUrl:data[0].imageUrl})
                }
             
            }
            return withId
        } else{
            console.log( '[]:', url)
                return[]
            }
 
debugger

}

function filterArray(firstArray, secondArray) {
    // Create a new empty array to store the filtered results.
    const filteredArray = [];
  
    // Iterate over the first array.
    for (const element of firstArray) {
      // Check if the element is present in the second array.
      if (!secondArray.includes(element)) {
        // If the element is not present in the second array, add it to the filtered results array.
        filteredArray.push(element);
      }
    }
  
    // Return the filtered results array.
    return filteredArray;
  }

module.exports={commonHandler}