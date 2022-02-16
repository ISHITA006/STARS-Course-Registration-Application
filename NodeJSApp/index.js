const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db.js');
var moduleController = require('./controllers/moduleController.js');
var studentController = require('./controllers/studentController.js');
var indexSwapController = require('./controllers/indexSwapController.js');
var indexAlgoController = require('./controllers/indexAlgoController.js');
var printTimetableController = require('./controllers/printTimetableController.js');
var generateTimetableController = require('./controllers/generateTimetableController.js');
var generateCombinationsController = require('./controllers/generateCombinationsController.js');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3000, () => console.log('Server started at port : 3000'));

app.use('/courseInfo', moduleController);
app.use('/students', studentController);
app.use('/indexSwap', indexSwapController);
app.use('/printTimetable', printTimetableController);
app.use('/generateTimetable', generateTimetableController);
app.use('/generateCombinations', generateCombinationsController);
setInterval(indexAlgoController.runIndexSwapAlgo, 30*60*1000);