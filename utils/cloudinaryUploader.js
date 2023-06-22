


(async () => {
  require('dotenv').config()


  const {
    Worker, isMainThread, parentPort, workerData
  } = require('node:worker_threads');
  var promiseRetry = require('promise-retry');


  const { buffers } = workerData
  await Promise.all(buffers.map(async (m) => {

    const { index, keywords } = m
    await promiseRetry(async function (retry, number) {
      try {
        debugger
        await upload(JSON.stringify(keywords), index)
        debugger
      } catch (error) {
        if (err.http_code === '499') {
          console.log('attempt number', number);
          retry(err);
          throw err;
        }
      }
    })
  }))

})()


function upload(buffer, public_id) {

  var cloudinary = require('cloudinary').v2;
  const streamifier = require('streamifier')
  cloudinary.config({
    cloud_name: 'codergihub',
    api_key: '583195742238215',
    api_secret: process.env.cloudinary_secret,
    secure: true
  })
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: 'navigation',
        public_id, resource_type: 'auto',
      },
      (error, result) => {
      

        if (result) {
          debugger
        
          resolve(result);

        } else {
          debugger
          console.log('error', error)
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });


}

//module.exports = { cloudinaryUploader }