
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {client} =require('./client.js')

  const rest =await client.collections('products').delete();
  console.log('DELETED',rest)