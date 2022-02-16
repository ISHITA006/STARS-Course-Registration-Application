let MongoClient = require('mongodb').MongoClient;


let url = 'mongodb://127.0.0.1:27017';
var json = {};

async function fetch(){
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('indexSwap');
  try{
    // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
    // don't see when we need it but okay
    var cursor = await collection.findOne({"COURSE": "CE2006"});
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function algo(){
  console.log("This is extracted from my indexSwap script which fetch and replaces the entire document");
  console.log("It's fairly primitive but I think it's enough.");
}

async function update(){
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('indexSwap');
  try{
    // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
    // don't see when we need it but okay
    var cursor = await collection.findOneAndUpdate({"COURSE": "CE2006"}, json);
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function main(){
  await fetch();
  await algo();
  await update();
}

main();
