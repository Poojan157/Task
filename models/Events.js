const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id : {
        type : String,
        requrird : true,
        unqiue : true
    },
    name : {
        type : String,
        required : true,
        unique : true
    },
    date : {
        type : Date,
        required : true
    },
    capacity : {
        type : Number,
        required : true,
        min : 1
    },
    availableSeats :  {
        type : Number,
        required : true,
        min : 0
    }
})

module.exports = mongoose.model('Events',eventSchema);