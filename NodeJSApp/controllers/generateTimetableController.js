let express = require('express');
let router = express.Router();
let fs = require('fs')
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
//var htmlTables = "";

// Should modify for input to be taken from frontend
var input = [];
var course_arr = [];
var timetableOutput = [];
var timetableHtmlList = [];

/*
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
*/

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
  table = new Array(cols);
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

async function writeTimetable(){
  html = "<table border='1'>";
  for(var i = 0; i < rows; i++){
    html += "<tr height='120'>";
    for(var j = 0; j < cols; j++){
      html += table[j][i];
    }
    html += "</tr>";
  }
  html += "</table>";
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

// Fetches course information required
async function fetch() {
    var client = await MongoClient.connect(url)
    var collection = client.db('stars_plus_plus').collection('courseInfo');
    try {
        // find() requires .next() as such .find({"COURSE": "CE2006"}).next()
        // don't see when we need it but okay
        input = input.split(",");
        for (var i = 0; i < input.length; i++) {
            var temp = await collection.findOne({ 'COURSE': input[i] });
            course_arr.push(temp)
        }
        //delete temp["_id"];
    }
    catch (e) {
        console.log(e);
    }
    finally {
        client.close();
    }
}

async function generateTimetable() {
    // Remember that course information stored in course_arr
    var multiple_index_list = []

    // Split into array consisting of indexes
    for (var i = 0; i < course_arr.length; i++) {
        multiple_index_list.push(course_arr[i]['INDEX_LIST'])
    }

    // Function used to generate all combinations
    function cartesianProduct(arr) {
        return arr.reduce(function (a, b) {
            return a.map(function (x) {
                return b.map(function (y) {
                    return x.concat([y]);
                })
            }).reduce(function (a, b) { return a.concat(b) }, [])
        }, [[]])
    }

    var permutations = cartesianProduct(multiple_index_list)

    //console.log("Length of permutations:", permutations.length)

    // Checks for clash in week
    function compareWeeks(week_i, week_j) {
        for (var x in week_i)
            for (var y in week_j)
                if (week_i[x] == week_j[y]) {
                    return 1
                }
        return 0
    }

    // Checks for clash in time
    function compareTime(time_i, time_j) {
        // TODO: Modify the web scraper to save time as a int so we do not need to repeatedly parseInt

        // Case 1: Start of first index is between second index
        if (parseInt(time_i['START']) >= parseInt(time_j['START']) && parseInt(time_i['START']) < parseInt(time_j['END']))
            return 1

        // Case 2: End of first index is between second index
        if (parseInt(time_i['END']) > parseInt(time_j['START']) && parseInt(time_i['END']) <= parseInt(time_j['END']))
            return 1

        return 0 // 0 Means no clash
    }

    function compareTwoIndex(index_i, index_j) {
        //console.log("index:", index_i, index_j)
        for (var activity_i in index_i['ACTIVITIES']) {
            for (var activity_j in index_j['ACTIVITIES']) {

                // Check for clash in weeks first before we bother checking day
                if (compareWeeks(index_i['ACTIVITIES'][activity_i]['WEEK'], index_j['ACTIVITIES'][activity_j]['WEEK'])) {

                    // Check for clash in day before we bother checking against time
                    if (index_i['ACTIVITIES'][activity_i]['DAY'] == index_j['ACTIVITIES'][activity_j]['DAY']) {
                        // Check for clash in time
                        if (compareTime(index_i['ACTIVITIES'][activity_i]['TIME'], index_j['ACTIVITIES'][activity_j]['TIME'])) {
                            //console.log("Clash:", index_i["INDEX"], index_j["INDEX"])
                            return 1 // 1 means clash
                        }
                    }
                }
            }
        }
        //console.log("No clash", index_i["INDEX"], index_j["INDEX"])
        return 0 // No clash
    }

    combi_length = permutations[0].length

    var valid_combi = []

    // Loops through permutation list
    for (var i = 0; i < permutations.length; i++) {
        // Loops through combination list
        for (var j = 0; j < combi_length; j++) {
            // Loops through the indexes infront of combination, to check if there's a clash
            for (var k = j + 1; k < combi_length; k++) {
                // TODO: Consider creating map of clashing combi, set to -1 by default, 0 for no clash, 1 for clash
                // if (clash_combi[permutations[i][j]["INDEX"]]permutations[i][k]["INDEX"] == 0) continue
                // if (clash_combi[permutations[i][j]["INDEX"]]permutations[i][k]["INDEX"] == 1) {clash=1 break}

                // If yet to be mapped, == -1, we then proceed to calculate
                var clash = compareTwoIndex(permutations[i][j], permutations[i][k])
                if (clash) break
            }
            if (clash) break
        }
        if (clash) {
            // clash_combi[permutations[i][j]["INDEX"]]permutations[i][k]["INDEX"] = 1 // Update clash value
            //console.log("Clash index:", permutations[i][j]["INDEX"], permutations[i][k]["INDEX"])
            continue
        }

        valid_combi.push(permutations[i]) // If no clash for all mods, we push

    }

    //console.log("No. of valid combi = ", valid_combi.length)
    //console.log(valid_combi)

    for (var i = 0; i < valid_combi.length; i++) {
        var display_timetable_combi = {}
        for (var j = 0; j < input.length; j++) {
            display_timetable_combi[input[j]] = valid_combi[i][j]["INDEX"]
        }
        timetableOutput.push(display_timetable_combi) // Note that timetableOutput is a global variable being used
    }

    //console.log(timetableOutput)
    valid_combinations = valid_combi // Copy to global array to be used later
}

async function main(httpCourseList, res){
  var htmlTables = "";
  var i = 0, j = 0, k = 0, l = 0, m = 5;
  try{
    input = httpCourseList;
    course_arr = [];
    timetableOutput = [];
    timetableHtmlList = [];
    await fetch();
    await generateTimetable();

    for(l = 0; l < m; l++){
      var courseList = [];
      var indexList = [];
      var indexInfo = {};

      await initTimetable();
      start = 0, end = 0, day = 0;
      courseList = Object.keys(timetableOutput[l]);
      indexList = Object.values(timetableOutput[l]);
      if(courseList.length < m) m = courseList.length;

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
      await writeTimetable();
      timetableHtmlList[l] = html;
      //htmlTables += html;
    }
    await console.log("generated 5 timetables");
    res.send(timetableHtmlList);
    //res.send("<html>" + htmlTables + "</html>");
  }
  catch(error){
      console.log(error);
  }
}

router.get('/:courseList', function(req, res){
  try{
    // current value of req.params.courseList sent as
    // CE2002,CE2005,CE2006,CE2100,CE2101,CE2107
    // it is a string
    // it is sent to a string then split by separator ','
    // resulting in a list of strings of each individual course
    // line 198
    main(req.params.courseList.toString(), res);
  }
  catch(error){
    console.log(error);
  }
});

module.exports = router;