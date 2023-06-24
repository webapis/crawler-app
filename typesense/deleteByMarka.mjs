
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {client} =require('./client.js')

  const rest =await client.collections('products').documents().delete({'filter_by': `marka:${process.env.marka}`});

  console.log('DELETED',rest)