const mongoose = require("mongoose");
const moment = require("moment");
const userSchema = new mongoose.Schema({

    nama : {
        type : String,
        required: true,
    },
    harga : {
        type : String,
        required: true,
    },
    image : {
        type : String,
        required: true,
    },
    created : {
        type : Date,
        required: true,
        default: Date.now,
        get: (value) => moment(value).format('D MMMM YYYY, HH:mm')
    },
});
module.exports = mongoose.model("Cars", userSchema);
