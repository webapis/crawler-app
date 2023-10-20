
function getSearchUrls({ searchterm }) {

    const brands = {
        abiyefon: { url: `https://www.abiyefon.com/search/?q=${searchterm.replaceAll(' ', '+')}`,cat:['elbise']  },
        addax: { url: `https://www.addax.com.tr/tr/p/Cat/NewSearch?sr=${searchterm.replaceAll(' ', '+')}`,cat:['elbise'] },
        adidas: { url: `https://www.adidas.com.tr/tr/${searchterm.replaceAll(' ', '_')}` ,cat:['spor']},
        adl: { url: `https://www.adl.com.tr/list/?search_text=${searchterm.replaceAll(' ', '+')}`,cat:['elbise'] },
        alinderi: { url: `https://alinderi.com.tr/module/iqitsearch/searchiqit?s=${searchterm.replaceAll(' ', '+')}`,cat:['deri'] },
        alpinist: { url: `https://www.alpinist.com.tr/arama/${searchterm.replaceAll(' ', '%20')}`,cat:['outdoor'] }
    }

    return Object.entries(brands)

}


module.exports = {
    getSearchUrls
}