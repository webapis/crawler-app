function productTitleMatch({ kw, title, nws }) {


    let negativeMatchNotFound = false

    const sortedKeywords =kw.split(',').sort(function (a, b) {

        return b.length - a.length;
    })
    const positiveMatchFound = sortedKeywords.some(function (keyword) {
    
        const reg = new RegExp('(\\s|\\b)'+keyword+'($|\\s)', 'i')

        const test = reg.test(title)
    

        return test === true

    })

    if (positiveMatchFound) {
       
            if (nws.length > 0) {

                negativeMatchNotFound = nws.some((keyword) => {

                    const reg = new RegExp(keyword, 'i')

                    const test = reg.test(title)

                    return test
                })


            }
        

    }

    const result = positiveMatchFound && (negativeMatchNotFound === false)

    return result



}




export  {
    productTitleMatch
};
