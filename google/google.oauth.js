require('dotenv').config()

const { google } = require('googleapis')

async function getGoogleToken() {

   const scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.metadata']


  if (process.env.access_token) {
    
    const issuetime = parseInt(process.env.expires_in) * 1000 + parseInt(process.env.lasttimestamp)
    const currenttimestamp = Date.now()

    if (process.env.expires_in && issuetime > currenttimestamp) {
      
      console.log('old access token.......')
      
      return process.env.access_token

    } else {
      const auth = new google.auth.GoogleAuth({ keyFile: './encdata/turkmenistan-market-f1b9872438ea.json', scopes })
   

    const access_token = await auth.getAccessToken()   
  
      process.env.expires_in = 15000
      process.env.access_token = access_token
      process.env.lasttimestamp = Date.now()
      console.log('refreshed access token......0.')
      return access_token
    }
  } else {

    const auth = new google.auth.GoogleAuth({ keyFile: './encdata/turkmenistan-market-f1b9872438ea.json', scopes })
    
 
     const access_token = await auth.getAccessToken()   
   
       process.env.expires_in = 15000
       process.env.access_token = access_token
       process.env.lasttimestamp = Date.now()
       console.log('refreshed access token......1.')
       return access_token
  }

}

module.exports = { getGoogleToken }