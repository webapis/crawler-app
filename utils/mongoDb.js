

require('dotenv').config()
const stream = require('stream')
const { MongoClient } = require('mongodb')

debugger
//const stream = require('stream')
const fs = require('fs')
const path = require('path')

const makeDir = require('make-dir');
//var through = require("through2");
//var jsonArrayStreams = require("json-array-streams");


async function mongoClient({ collectionName }) {
    const client = new MongoClient('mongodb://localhost:27017/streamToMongoDB', { useNewUrlParser: true, useUnifiedTopology: true });

    const clnt = await client.connect()
    const collection = clnt.db("streamToMongoDB").collection(collectionName);

    return collection
}
async function importData({ collectionName, folder }) {

    try {
        console.log('IMPORTING DATA STARTED....')
        const files = fs.readdirSync(folder)
        const collection = await mongoClient({ collectionName })
        await collection.deleteMany({})
        let totaldata =0
        for (let file of files) {
      
            const data = fs.readFileSync(`${folder}/${file}`, { encoding: 'utf8' })
           
            const dataObjectArr = JSON.parse(data)
            totaldata=totaldata+dataObjectArr.length
            await collection.insertMany(dataObjectArr)
        }
        console.log('IMPORTING DATA COMPLETE....',totaldata)
    } catch (error) {
        console.log('error importing data', error)
    }
}

async function exportData({ exportPath, collectionName, aggegation }) {
    console.log('EXPORTING DATA STARTED....')

    const collection = await mongoClient({collectionName})
  
    const cursor = await collection.aggregate(aggegation, { allowDiskUse: true })
    const cursor2 = await collection.aggregate(aggegation, { allowDiskUse: true })

    const dirname = path.dirname(exportPath)
    await makeDir(dirname)
    const writeStream = fs.createWriteStream(exportPath)
    writeStream.write('[')
    const countdata = await cursor2.toArray()
  
    let parcedData = 0
    cursorAsStream = stream.Readable.from(cursor.map(async (entry) => {  
      ++parcedData
      const {priceNew} =entry
    

      if (parcedData === countdata.length) {
      
        return JSON.stringify(entry) + '\n'
      }
  
      return JSON.stringify(entry) + ',\n'
  
    }))
    cursorAsStream.pipe(writeStream);
  
    return new Promise((resolve, reject) => {
  
      writeStream.on('finish', async() => {
  
  
        console.log('EXPORTING DATA COMPLETED......')
        fs.appendFileSync(exportPath, ']')
        resolve(true)
      })
      writeStream.on('pipe', () => {
        console.log('data recieved')
      })
      writeStream.on('error', (error) => {
        console.log('export error', error)
        reject(error)
      })
      
    })
  
 
}

async function extractNavData({collection,exportPath}) {
    const dirname = path.dirname(exportPath)
    debugger;
    await makeDir(dirname)

    const data = await collection.aggregate([{ $project: { _id: 0, marka: 0 } }]).toArray()
    if (fs.existsSync(exportPath)) {
        fs.unlinkSync(exportPath)
    }

    fs.appendFileSync(exportPath, JSON.stringify(data))
    console.log('exportpath',exportPath)
   const files = fs.readdirSync(dirname)
   files.forEach(file => {
    console.log('file',file);
  });
    debugger;

}
module.exports = { importData, exportData,mongoClient,extractNavData }


/*
async function exportData({ exportPath, collectionName, aggegation }) {
    console.log('EXPORTING DATA STARTED....')
    const client = new MongoClient('mongodb://localhost:27017/streamToMongoDB', { useNewUrlParser: true, useUnifiedTopology: true });
    const clnt = await client.connect()
    const collection = clnt.db("streamToMongoDB").collection(collectionName);
    const data = await collection.aggregate(aggegation).toArray()
    debugger;
    const dirname = path.dirname(exportPath)
    debugger;
    await makeDir(dirname)
    if (fs.existsSync(exportPath)) {
        fs.unlinkSync(exportPath)
    }
    fs.appendFileSync(exportPath, JSON.stringify(data))
    console.log('EXPORTING DATA COMPLETE....',data.length)
 
}
*/