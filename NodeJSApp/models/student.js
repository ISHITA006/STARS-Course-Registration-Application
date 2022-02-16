const mongoose = require('mongoose');

var Student = mongoose.model('Student', {
_id: { type: mongoose.Schema.Types.ObjectId },
USER_ID: {type : String},
NAME: { type: String},
PASSWORD: { type: String},
MATRIC: { type: String},
TOTAL_AU: { type: Number},
REGISTERED_COURSES: {type: Object},
SAVED_PLANS: [{type:Object}]
}, 'students');

module.exports = { Student } ;
