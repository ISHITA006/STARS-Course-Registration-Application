const mongoose = require('mongoose');

var IndexSwap = mongoose.model('IndexSwap', {
_id: { type: mongoose.Schema.Types.ObjectId },
COURSE: { type: String},
current: {type:Object},
registered: {type: Object},
queue:{type : Object}

}, 'indexSwap');

module.exports = { IndexSwap } ;