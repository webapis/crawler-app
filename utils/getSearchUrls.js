
function getSearchUrls({ searchterm }) {

    const brands = {
        abiyefon: { url: `https://www.abiyefon.com/search/?q=${searchterm.replaceAll(' ', '+')}`,group:['elbise'],searchterm  },
        addax: { url: `https://www.addax.com.tr/tr/p/Cat/NewSearch?sr=${searchterm.replaceAll(' ', '+')}`,group:['elbise'],searchterm  },
        adidas: { url: `https://www.adidas.com.tr/tr/${searchterm.replaceAll(' ', '_')}` ,group:['spor']},
        adl: { url: `https://www.adl.com.tr/list/?search_text=${searchterm.replaceAll(' ', '+')}`,group:['elbise'],searchterm  },
        alinderi: { url: `https://alinderi.com.tr/module/iqitsearch/searchiqit?s=${searchterm.replaceAll(' ', '+')}`,group:['deri'],searchterm  },
        alpinist: { url: `https://www.alpinist.com.tr/arama/${searchterm.replaceAll(' ', '%20')}`,group:['outdoor'],searchterm  }
    }

    return Object.entries(brands)

}


module.exports = {
    getSearchUrls
}