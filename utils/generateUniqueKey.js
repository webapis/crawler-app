var hash = require('object-hash');

function generateUniqueKey(obj) {
  // Get the property values of the object.
  var propertyValues = Object.values(obj)

  // Combine the property values into a string.
  var keyString = propertyValues.join("-");

  // Convert the string to a hash.
  var key = hash(keyString);

  return key;
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// from https://stackoverflow.com/a/11562550/9014097
function buf2Base64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}


async function inBrowserKey(inputString) {

  inputBytes = new TextEncoder().encode(inputString);
  hashBytes = await window.crypto.subtle.digest("SHA-256", inputBytes);
 // console.log(JSON.stringify({hash: buf2hex(hashBytes)})); // {"hash":"d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592"}
return  buf2Base64(hashBytes); // {"hash":"16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI="}
}
module.exports = { generateUniqueKey,inBrowserKey };
