
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {client} =require('./client.js')
let schema = {
    name: "products",
    fields: [
      {
        name: "title",
        type: "string",
        facet: false,
        optional:false
        
      },
      {
        name: "marka",
        type: "string",
        facet: true,
        optional:false,
        sortable:true
      },
      {
        name: "gender",
        type: "string",
        facet: true,
        optional:false
      },
      {
        name: "renk",
        type: "string",
        facet: true,
        optional:false
      },
      {
        name: "price",
        type: "float",
        facet: true,
        optional:false
      },
      {
        name: "link",
        type: "string",
        facet: false,
        optional:false
      },
      {
        name: "imageUrl",
        type: "string",
        facet: false,
        optional:false
      },
      {
        name: "kategori",
        type: "string",
        facet: true,
        sortable:true
      },
      {
        name: "altKategori",
        type: "string",
        facet: true,
        sortable:true
      },
    ],
    // default_sorting_field: "index",
  };
  const rest =await client.collections().create(schema);
 console.log('create schema',rest)