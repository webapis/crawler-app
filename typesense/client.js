const Typesense = require("typesense");

let client = new Typesense.Client({
  nodes: [
    {
      host: "cainkfusel2d9vzjp.a1.typesense.net", // For Typesense Cloud use cainkfusel2d9vzjp.a1.typesense.net
      port: "443", // For Typesense Cloud use 443
      protocol: "https", // For Typesense Cloud use https
    },
  ],
  apiKey: "V4FN9a4QTCYkq8zWjjgs1YVonWDyrpSD",
  connectionTimeoutSeconds: 2,
});

module.exports={client}