require('dotenv').config()
const Typesense = require("typesense");

let client = new Typesense.Client({
  nodes: [
    {
      host: "8bvyol51xtzwnjqep-1.a1.typesense.net", // For Typesense Cloud use cainkfusel2d9vzjp.a1.typesense.net
      port: "443", // For Typesense Cloud use 443
      protocol: "https", // For Typesense Cloud use https
    },
  ],
  apiKey: process.env.API_KEY,
  connectionTimeoutSeconds: 2,
});

module.exports={client}