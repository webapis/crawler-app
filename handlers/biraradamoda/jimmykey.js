
async function extractor(page) {
 
    debugger;
    const data = await page.$$eval('.row.ProductList', (productCards) => {

        return productCards.map(document => {
            try {
                
           
            const imageUrl = document.querySelector('.Prd picture source[data-srcset]').getAttribute('data-srcset')
            const title = document.querySelector('.PName').innerHTML.trim()
            const priceNew =  document.querySelector('.PPrice').textContent.trim().replace('₺', '')
            const link = document.querySelector('.PrdItemBox a').href
   
            return {
                title: 'jimmykey ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'jimmykey',

            }

        } catch (error) {
            return {error:error.toString(),content:document.innerHTML
            }  
        }
        })
    })

  

    return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


const productPageSelector='.PrdContainer'
const linkSelector='nav#MainMenu a'
const linksToRemove=[]
const hostname='https://www.jimmykey.com/tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
