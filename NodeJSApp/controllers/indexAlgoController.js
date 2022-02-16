var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

var url = 'mongodb://127.0.0.1:27017';
var query = {};

var position = "";
var course = [], student = [], visited = [], stack = [];
var json = {}, linkedlist = {}, updates = {};
var flag = false, cycle = false;

async function fetchCourse(){
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

async function updateCourse(){
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('indexSwap');
  try{
    var cursor = await collection.replaceOne(query, json);
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function indexSwap(){
  var i = 0, j = 0, k = 0, l = 0;
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
        if(Array.isArray(linkedlist[position])){
          for(k = 0; k < linkedlist[position].length; k++){
            if(visited[0] == linkedlist[position][k]){
              cycle = true;
              break;
            }
            stack.push(linkedlist[position][k]);
          }
        }
        if(cycle){
          // this part is used to add/drop courses in the 3 json after a match is found
          // this removes them from the course in registered jsone
          json["registered"][visited[visited.length-1]].splice(json["registered"][visited[visited.length-1]].indexOf(visited[0]), 1);
          for(k = 1; k < visited.length-1; k += 2) json["registered"][visited[k]].splice(json["registered"][visited[k]].indexOf(visited[k+1]), 1);
          // this adds them back to the course in registered json
          for(k = 1; k < visited.length; k += 2) json["registered"][visited[k]].push(visited[k-1]);
          // this removes the students who have successfully swapped their index from the queue json
          for(k = 0; k < visited.length; k += 2) delete json["queue"][visited[k]];
          // this removes the students who have successfully swapped their index from the current json (registered students who are in queue)
          json["current"][visited[visited.length-1]].splice(json["current"][visited[visited.length-1]].indexOf(visited[0]), 1);
          for(k = 1; k < visited.length-1; k += 2) json["current"][visited[k]].splice(json["current"][visited[k]].indexOf(visited[k+1]), 1);
          updates[l] = visited;
          l++;
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

async function sendEmail(studentId, courseId, index){
  var emailAddress = "ghotinggoad@gmail.com";
  var message = "";

  let transport = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
     auth: {
       user: "starsplusplus@gmail.com",
       pass: "softwareengineering"
     }
  });
  message = "Hi ";
  message += studentId.toString();
  message += ",\n\nYou've successfully registered Course ";
  message += courseId.toString();
  message += ", Index ";
  message += index.toString();
  message += "!\n\n\nRegards,\nSTARS++ Team.\n";

  var mailOptions = {
       from: "starsplusplus@gmail.com", // Sender address
       to: emailAddress, // List of recipients
       subject: 'STARS++ Index registered!', // Subject line
       text: message // Plain text body
  };

  transport.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
}

async function updateStudents(course){
  var form;
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('students');
  try{
    // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
    // don't see when we need it but okay
    var i, j;
    var cycles = Object.keys(updates);
    for(i = 0; i < cycles.length; i++){
      for(j = 0; j < updates[cycles[i]].length; j+=2){
        form = await collection.findOne({"USER_ID": updates[cycles[i]][j]});
        form["REGISTERED_COURSES"][course] = Number(updates[cycles[i]][j+1]);
        await collection.replaceOne({"USER_ID": updates[cycles[i]][j]}, form);
        sendEmail(updates[cycles[i]][j], course, updates[cycles[i]][j+1]);
      }
    }
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function main(){
  var i = 0;
  var temp = {};
  var client = await MongoClient.connect(url)
  var collection = client.db('stars_plus_plus').collection('indexSwap');

  try{
    // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
    // don't see when we need it but okay
    var courseList = await collection.find().toArray();
    for(i = 0; i < courseList.length; i++){
      query = {"COURSE": courseList[i]["COURSE"]};
      await fetchCourse();
      await indexSwap();
      await updateCourse();
      await updateStudents(courseList[i]["COURSE"]);
      console.log("finished cycling " + courseList[i]["COURSE"]);
    }
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

module.exports.runIndexSwapAlgo = main;

//main();
