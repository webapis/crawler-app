


(async () => {
    require('dotenv').config()

    await generateKeyword()


    process.exit(0)

})()


async function generateKeyword() {
    const fs = require('fs')
    const uri = process.env.MONGODB_URL
    const { MongoClient} = require('mongodb');
    const makeDir = require('make-dir');
debugger
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect()
    const db = client.db("biraradamoda");

    let collection = db.collection('keywords');

    let datas = await collection.find({ $or: [ { disabled: { $exists: false } }, { disabled: {$eq:false} } ] }).toArray()
debugger
    let categoryItems = datas.map((m,i)=>{
        const mappedData =m
        delete mappedData['_id']
        return {...mappedData,index:(i+1).toString()}})



    debugger


    const data = categoryItems

    await makeDir(`api/_files/nav`)

    if (fs.existsSync(`api/_files/nav/keywords.json`)) {
        fs.unlinkSync(`api/_files/nav/keywords.json`)
    }
    fs.appendFileSync(`api/_files/nav/keywords.json`, JSON.stringify(data))


    if (fs.existsSync(`src/keywords.json`)) {
        fs.unlinkSync(`src/keywords.json`)
    }
    if (fs.existsSync(`public/keywords.json`)) {
        fs.unlinkSync(`public/keywords.json`)
    }
    if (fs.existsSync(`src/category-nav.json`)) {
        fs.unlinkSync(`src/category-nav.json`)
    }

    const reduced = data.reduce((prev, curr) => {

        return {
            ...prev, [curr.index+"-"]: { groupName:curr.groupName,title:curr.title,
                keywordType:curr.keywordType,keywords:curr.keywords }
        }
    }, {})
    debugger
    fs.appendFileSync(`src/keywords.json`, JSON.stringify(reduced))
    fs.appendFileSync(`public/keywords.json`, JSON.stringify(reduced))
 
    debugger
    const mappedCatItems = categoryItems.filter(f=>f.keywordType ==='category').map(m => {

        debugger
        return { ...m, index: m.index + '-' }
    })
    debugger
    const grouped = groupBy([...mappedCatItems, { title: 'diger', exclude: '', functionName: 'diger', groupName: 'diger', index: '0-' }], 'groupName')
    fs.appendFileSync(`src/category-nav.json`, JSON.stringify(grouped))

}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};