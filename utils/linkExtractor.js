const { Dataset, RequestQueue } = require("crawlee");
async function linkExtractor({
  candidateSelector,
  productPageSelector,
  linkSelector,
  linksToRemove,
  hostname,
  exclude,
  postFix,
  page,
  context,
  action
}) {

  const { request: { userData: { lx } } } = context
  console.log('lx',lx)
  console.log('action',action)
  const requestQueue = await RequestQueue.open();
  debugger;
  const navigationItems = await page.$$(candidateSelector);

  let links = [];
  debugger;
  // Iterate over the navigation items and hover over each of them.
  if(lx){
    return 
  }
  for (const navigationItem of navigationItems) {
    try {
      if(action==='hover'){
        await navigationItem.hover();
      }
      if(action==='click'){
        await navigationItem.click();  
      }
      await page.waitForTimeout(1000);
      const currentLinks = await page.evaluate(
        (linkSelector, hostname) =>
          Array.from(document.querySelectorAll(linkSelector))
            .map((m, i) => {
              return {
                href: m.href,
                title: m.innerText.replaceAll("\n", "").trim(),
                order: i,
              };
            })
            .filter((f) => f.href.includes(hostname)),
        linkSelector,
        hostname
      );

      links.push(...currentLinks);
      console.log("links.length inside lovemy body", links.length);
    } catch (error) {
      console.log("hover error", error.toString());
    }


    
  }
  debugger;
  const linkDataset = await Dataset.open(`links`);
  await linkDataset.pushData({
    links: links.map((m, i) => {
      return { url: m.href, title: m.title };
    }),
  });

  for(let l of links ){
    let negative =false
  
    if(exclude.length>0){
        for(let e of exclude){ 
            if(l.href.indexOf(e) !==-1){
        
                negative=true
            }
        }
    } 

 if(linksToRemove.find(f=> f===l.href)===undefined && !negative && l.href.length<=150 ){
    

await  requestQueue.addRequest({ url:l.href.replace(postFix,'') + postFix,  userData:{start:true,title:l.title,order:l.order, total:links.length} })
          
   }

}
}

module.exports = { linkExtractor };
