let fs = require('fs')

let rows = 16;
let cols = 7;
let days = ["TIME/DAY", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let timeslot = ["TIME/DAY", "830", "0930", "1030", "1130", "1230", "1330", "1430", "1530", "1630", "1730", "1830", "1930", "2030", "2130", "2230"];
var table = new Array(cols);
var html = "";

async function init(){
  var i;
  for(var i = 0; i < cols; i++){
    table[i] = new Array(rows);
		table[i][0] = "<td>" + days[i] + "</td>";
	}
  for(i = 0; i < rows; i++){
    table[0][i] = "<td>" + timeslot[i] + "</td>";
  }
  for(i = 1; i < rows; i++){
    for(var j = 1; j < cols; j++){
      table[j][i] = "<td>sus</td>";
    }
  }
}

async function write(){
  for(var i = 0; i < rows; i++){
    html += "<tr>";
    for(var j = 0; j < cols; j++){
      html += table[j][i];
    }
    html += "</tr>";
  }

  fs.writeFile("./sus.html", "<table border='1'>" + html + "</table>", (error) => {
    if(error){
      console.log(error);
    }
    else{
      console.log("done and dusted");
    }
  });
}

async function main(){
  await init();
  await write();
}

main();
