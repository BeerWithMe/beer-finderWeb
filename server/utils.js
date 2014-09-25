// This file contains all utility functions for server code

// This function takes in the returned nodes from neo4j query
// and return all nodes as object back.
// This function gets required by dbConfig.js
exports.makeData = function(data, key){
  if(!data || !(data.length)){
    return false;
  } else {
    var results = [];
    for(var i = 0; i < data.length; i++){
      var current = data[i][key]._data.data;
      results.push(current);
    }
  }
  return results;
};
