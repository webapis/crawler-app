
function getSearchUrls({searchterm}){

    const brands ={
    // abiyefon:{url:`https://www.abiyefon.com/search/?q=${searchterm.replaceAll(' ','+')}`},
    // addax:{url:`https://www.addax.com.tr/tr/p/Cat/NewSearch?sr=${searchterm.replaceAll(' ','+')}`},
    // adidas:{url:`https://www.adidas.com.tr/tr/${searchterm.replaceAll(' ','_')}`},
  //  adl:{url:`https://www.adl.com.tr/list/?search_text=${searchterm.replaceAll(' ','+')}`},
 // alinderi:{url:`https://alinderi.com.tr/module/iqitsearch/searchiqit?s=${searchterm.replaceAll(' ','+')}`},
 alpinist:{url:`https://www.alpinist.com.tr/arama/${searchterm.replaceAll(' ','%20')}`}
}

return Object.entries(brands)

}


module.exports={
    getSearchUrls
}