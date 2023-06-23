
function orderData(data) {
    try {
        
  
    const splittedByMarkaObj = {}
    const spliteed=data
    spliteed.forEach(element => {
        const marka = element.marka
        const isArray = Object.prototype.toString.call(splittedByMarkaObj[marka]) === '[object Array]';
     
        if (!isArray) {
            splittedByMarkaObj[marka] = []
            splittedByMarkaObj[marka].push(element)
        } else {
            splittedByMarkaObj[marka].push(element)
        }

    });

    const convertToArray = Object.values(splittedByMarkaObj)
    const sortByLongest = convertToArray.sort(function (a, b) {
        return b.length - a.length;
    });

    const keys = Object.keys(sortByLongest)
    const longestarr = sortByLongest[0]
    const orderedArray = []
    longestarr.forEach((f, n) => {
        orderedArray.push(...keys.map((k, i) => {
            return sortByLongest[i][n]

        }))
    })

    return orderedArray.filter(f => f !== undefined)

} catch (error) {

    return undefined
 
}
}


 export default   orderData
