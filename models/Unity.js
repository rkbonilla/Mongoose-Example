var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new Schema({
    ScreenName: {
        type: String,
        require: true
    },
    FirstName: {
        type: String,
        require: true
    },
    LastName: {
        type: String,
        require: true
    },
    StartDate: {
        type: String,
        require: true
    },
    Score: {
        type: Number,
        require: true
    },
});

mongoose.model("unity", Schema);