const fs = require('fs')
const fetch = require('node-fetch')


async function fetchImages(urls) {
    const { url: url1, filepath: filepath1, imgTitle: title1 } = urls[0]
    const { url: url2, filepath: filepath2, imgTitle: title2 } = urls[1]



    return new Promise(async (resolve, reject) => {

        try {
            const response1 = await fetch(url1, { headers: { 'Content-Type': 'image/jpeg' } })
            const contentType = response1.headers.get('content-type')
            if (response1.ok && contentType === 'image/jpeg') {
                const stream1 = fs.createWriteStream(filepath1)
                stream1.on('close', () => {
                    console.log('close1', stream1.bytesWritten, filepath1, url1)
                    resolve({filepath:filepath1,title:title1})
                })
                stream1.on('error', (error) => {

                    reject(error)
                })

                response1.body.pipe(stream1)
            } else {

                const response2 = await fetch(url2, { headers: { 'Content-Type': 'image/jpeg' } })
                const contentType = response2.headers.get('content-type')
                if (response2.ok && contentType === 'image/jpeg') {
                    const stream2 = fs.createWriteStream(filepath2)

                    stream2.on('close', (c) => {

                        console.log('close2', stream2.bytesWritten, filepath2, url2)
                        resolve({filepath:filepath2,title:title2})
                    })

                    stream2.on('error', error => {

                        console.log('error2', filepath2)
                        reject(error)
                    })
                    response2.body.pipe(stream2)
                }
                else {

                    throw 'Error fetch image' + url2
                }


            }


        } catch (error1) {

            const response2 = await fetch(url2, { headers: { 'Content-Type': 'image/jpeg' } })
            const contentType = response2.headers.get('content-type')
            if (response2.ok && contentType === 'image/jpeg') {
                const stream2 = fs.createWriteStream(filepath2)

                stream2.on('close', (c) => {

                    if (stream2.bytesWritten === 0) {
                        console.log('close3', stream2.bytesWritten, filepath2, url2)
                    }
                    resolve({filepath:filepath2,title:title2})
                })

                stream2.on('error', error => {

                    console.log('error2', filepath2)
                    reject(error)
                })

                response2.body.pipe(stream2)
            } else {
                console.log('error111', error1)
            }

        }

    })
}

module.exports = { fetchImages }