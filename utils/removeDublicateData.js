


(async () => {
    console.log('--------------REMOVING DUBLICATE DATA STARTED-------------')
    const { importData, exportData } = require('./mongoDb')
    await importData({ collectionName: 'data', folder: 'data' })
debugger;
    const aggegation = [
        {
          '$group': {
            '_id': {
              'imageUrl': '$imageUrl'
            }, 
            'title': {
              '$first': '$title'
            }, 
            'priceNew': {
              '$first': '$priceNew'
            }, 
            'imageUrl': {
              '$first': '$imageUrl'
            }, 
            'link': {
              '$first': '$link'
            }, 
            'timestamp': {
              '$first': '$timestamp'
            },
            'category': {
              '$first': '$category'
            },
            'subcategory': {
              '$first': '$subcategory'
            },
            'marka': {
              '$first': '$marka'
            },
          }
        }, {
          '$unset': '_id'
        }
      ]

    await exportData({ exportPath: `${process.cwd()}/unique-data/data.json`, collectionName: 'data', aggegation })
    console.log('-------------REMOVING DUBLICATE DATA COMPLETE---------------')
    process.exit(0)
 
})()

