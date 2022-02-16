let express = require('express');
let router = express.Router();
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://127.0.0.1:27017';
var json = {};

let rows = 17;
let cols = 7;
let days = ["TIME/DAY", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let timeslot =
["TIME/DAY",
  "0800 to<br>0830",
  "0830 to<br>0930",
  "0930 to<br>1030",
  "1030 to<br>1130",
  "1130 to<br>1230",
  "1230 to<br>1330",
  "1330 to<br>1430",
  "1430 to<br>1530",
  "1530 to<br>1630",
  "1630 to<br>1730",
  "1730 to<br>1830",
  "1830 to<br>1930",
  "1930 to<br>2030",
  "2030 to<br>2130",
  "2130 to<br>2230",
  "2230 to<br>2330"];

var table = new Array(cols);
var html = "";

async function fetchCourseList(studentId){
  var client = await MongoClient.connect(url)
  var collection = client.db("stars_plus_plus").collection("students");
  try{
    // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
    // don't see when we need it but okay
    var cursor = await collection.findOne({"USER_ID": studentId});
    json = cursor["REGISTERED_COURSES"];
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function fetchIndexInfo(course, index){
  var client = await MongoClient.connect(url)
  var collection = client.db("stars_plus_plus").collection("courseInfo");
  try{
    var cursor = await collection.findOne({"COURSE": course});
    var i = 0;
    for(i = 0; i < cursor["INDEX_LIST"].length; i++){
      if(cursor["INDEX_LIST"][i]["INDEX"] == index) return cursor["INDEX_LIST"][i];
    }
  }
  catch(e){
    console.log(e);
  }
  finally{
    client.close();
  }
}

async function initTimetable(){
  var i;
  for(var i = 0; i < cols; i++){
    table[i] = new Array(rows);
		table[i][0] = "<td width='150'>" + days[i] + "</td>";
	}
  for(i = 0; i < rows; i++){
    table[0][i] = "<td>" + timeslot[i] + "</td>";
  }
  for(i = 1; i < rows; i++){
    for(var j = 1; j < cols; j++){
      table[j][i] = "<td></td>";
    }
  }
}

async function writeTimetable(studentId){
  html = "";
  for(var i = 0; i < rows; i++){
    html += "<tr height='120'>";
    for(var j = 0; j < cols; j++){
      html += table[j][i];
    }
    html += "</tr>";
  }
  /*
  fs.writeFile("./controllers/" + studentId + ".html", "<table border='1'>" + html + "</table>", (error) => {
    if(error){
      console.log(error);
    }
    else{
      console.log("done and dusted");
    }
  });
  */
}

function colFinder(day){
  switch (day) {
  case "MON":
    return 1;
  case "TUE":
    return 2;
  case "WED":
    return 3;
  case "THU":
    return 4;
  case "FRI":
    return 5;
  case "SAT":
    return 6;
  }
}

function rowFinder(time){
  switch (time) {
  case "0800":
    return 1;
  case "0820":
    return 1;
  case "0830":
    return 2;
  case "0920":
    return 2;
  case "0930":
    return 3;
  case "1020":
    return 3;
  case "1030":
    return 4;
  case "1120":
    return 4;
  case "1130":
    return 5;
  case "1220":
    return 5;
  case "1230":
    return 6;
  case "1320":
    return 6;
  case "1330":
    return 7;
  case "1420":
    return 7;
  case "1430":
    return 8;
  case "1520":
    return 8;
  case "1530":
    return 9;
  case "1620":
    return 9;
  case "1630":
    return 10;
  case "1720":
    return 10;
  case "1730":
    return 11;
  case "1820":
    return 11;
  case "1830":
    return 12;
  case "1920":
    return 12;
  case "1930":
    return 13;
  case "2020":
    return 13;
  case "2030":
    return 14;
  case "2120":
    return 14;
  case "2130":
    return 15;
  case "2220":
    return 15;
  case "2230":
    return 16;
  case "2320":
    return 16;
  case "2330":
    return 17;
  }
}

async function main(studentId, res){
  var i = 0, j = 0, k = 0, start = 0, end = 0, day = 0;
  var courseList = [];
  var indexList = [];
  var indexInfo = {};
  try{
    await initTimetable();
    await fetchCourseList(studentId);
    courseList = Object.keys(json);
    indexList = Object.values(json);
    for(i = 0; i < courseList.length; i++){
      // this part makes the html
      indexInfo = await fetchIndexInfo(courseList[i], indexList[i]);
      for(j = 0; j < indexInfo["ACTIVITIES"].length; j++){
        start = rowFinder(indexInfo["ACTIVITIES"][j]["TIME"]["START"]);
        end = rowFinder(indexInfo["ACTIVITIES"][j]["TIME"]["END"]);
        day = colFinder(indexInfo["ACTIVITIES"][j]["DAY"]);

        table[day][start] = "<td rowspan='";
        table[day][start] += end-start+1;
        table[day][start] += "'>";
        table[day][start] += courseList[i];
        table[day][start] += " ";
        table[day][start] += indexInfo["ACTIVITIES"][j]["TYPE"];
        table[day][start] += " ";
        table[day][start] += indexInfo["ACTIVITIES"][j]["GROUP"];
        table[day][start] += "<br> ";
        table[day][start] += indexInfo["ACTIVITIES"][j]["VENUE"];
        table[day][start] += "<br> ";
        table[day][start] += indexInfo["ACTIVITIES"][j]["REMARK"];
        table[day][start] += "<br> ";
        table[day][start] += "</td> ";

        // clear boxes below that are shifted by rowspan
        for(k = start+1; k < end+1; k++) table[day][k] = "";
      }
    }
    await writeTimetable(studentId);
    res.send("<table border='1'>" + html + "</table>");
    console.log("ezpz");
  }
  catch(error){
      console.log(error);
  }
}

router.get('/:id', function(req, res){
  try{
    main(req.params.id, res);
  }
  catch(error){
    console.log(error);
  }
});

module.exports = router;

