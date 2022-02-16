const mongoose = require('mongoose');

var Module = mongoose.model('Module', {
_id: { type: mongoose.Schema.Types.ObjectId },
COURSE: { type: String},
AU: { type: String},
NAME: { type: String},
REMARK: { type: String},
PREREQUISITE: { type: String},
MAX: {type: Number},
REGISTERED: {type: Number},
VACANCIES: {type: Number},
INDEX_LIST: [
    {
        INDEX: {type: Number},
        REGISTERED: {type: Number},
        VACANCIES: {type: Number},
        MAX: {type: Number},
        ACTIVITIES: [ {
            TYPE: { type: String},
            GROUP: { type: String},
            DAY: { type: String},
            TIME: { START: {type: String},
                    END: {type: String}
                },
            VENUE: { type: String},
            REMARK: { type: String}
        } ]

    }
]
}, 'courseInfo');

module.exports = { Module } ;
