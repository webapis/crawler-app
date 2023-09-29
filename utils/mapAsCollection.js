

const uniqify = (array, key) => array.reduce((prev, curr) => prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);


//generate many to many colletion
function generateMTM({data}){
    return data.map((m)=>{
        return {
            pid:m.pid,
            id:m.id
        }
    })
}

function uniquefyData({data}){
return uniqify(data,'id')
}

module.exports= {
    generateMTM,
    uniquefyData
}