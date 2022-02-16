var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://127.0.0.1:27017';
const query = {"COURSE": "CE2006"};

var i = 0, j = 0, k = 0;
var position = "";
var course = [], student = [], visited = [], stack = [];
var json = {}, linkedlist = {};
var flag = false, cycle = false;

async function fetch(){
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('indexSwap');
  try{
    // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
    // don't see when we need it but okay
    json = await collection.findOne(query);
    delete json["_id"];
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function update(){
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('indexSwap');
  try{
    var cursor = await collection.replaceOne(query, json);
    console.log(cursor);
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function indexSwap(){
  // get all the student id
  student = Object.keys(json["queue"]);
  // join the 2 sub-json together to make linkedlist for cycle detection, assign method will change original arrays
  Object.assign(linkedlist, json["current"], json["queue"]);

  for(j = 0; j < student.length; j++){
    cycle = false;
    flag = true; // true -> student node, false -> index node
    stack.push(student[j]);

    // check cycle
    while(stack.length > 0){
      position = stack.pop();
      visited.push(position);
      if(flag){
        if(!visited.includes(linkedlist[position])) stack.push(linkedlist[position]);
      }
      else{
        for(k = 0; k < linkedlist[position].length; k++){
          if(visited[0] == linkedlist[position][k]){
            cycle = true;
            break;
          }
          stack.push(linkedlist[position][k]);
        }
        if(cycle){
          // this part is used to add/drop courses in the 3 json after a match is found
          // this removes them from the course in registered json
          json["registered"][visited[visited.length-1]].splice(json["registered"][visited[visited.length-1]].indexOf(visited[0]), 1);
          for(j = 1; j < visited.length-1; j += 2) json["registered"][visited[j]].splice(json["registered"][visited[j]].indexOf(visited[j+1]), 1);
          // this adds them back to the course in registered json
          for(j = 1; j < visited.length; j += 2) json["registered"][visited[j]].push(visited[j-1]);
          // this removes the students who have successfully swapped their index from the queue json
          for(j = 0; j < visited.length; j += 2) delete json["queue"][visited[j]];
          // this removes the students who have successfully swapped their index from the current json (registered students who are in queue)
          json["current"][visited[visited.length-1]].splice(json["current"][visited[visited.length-1]].indexOf(visited[0]), 1);
          for(j = 1; j < visited.length-1; j += 2) json["current"][visited[j]].splice(json["current"][visited[j]].indexOf(visited[j+1]), 1);
          break;
        }
      }
      flag = !flag;
    }

    // reset dfs construct
    visited = [];
    stack = [];
  }
}

async function main(){
  await fetch();
  await indexSwap();
  await update();
}

main();
