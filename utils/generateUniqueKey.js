const crypto =require('crypto')

function generateUniqueKey(obj, properties) {
  // Get the property values of the object.
  var propertyValues = Object.keys(obj).filter(function (property) {
    return properties.includes(property);
  });

  // Combine the property values into a string.
  var keyString = propertyValues.join("-");

  // Convert the string to a hash.
  var key = crypto.createHash("sha256", keyString) .digest('hex');

  return key;
}


module.exports = { generateUniqueKey };
