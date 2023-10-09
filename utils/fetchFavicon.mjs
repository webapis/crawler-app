import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const path =require('path')
const fs = require('fs') // Built-in filesystem package for Node.js
const fetch = require('node-fetch')

function fetchFavicon({url,filename}) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url)
            const contentType = response.headers.get('content-type')
            const fileext = contentType.split('/')[1]
            const filepath = path.join( `${process.cwd()}`,`${filename}.${fileext}`)
            debugger
            const stream = fs.createWriteStream(filepath)
            stream.on('close', () => {
                  resolve(filepath)
            })
            response.body.pipe(stream)
            stream.on('error', (error) => {

                reject(error)
            })
        } catch (error) {
            reject(reject)
        }

    })
}

export default fetchFavicon