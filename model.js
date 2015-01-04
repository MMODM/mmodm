/**
* Model Module: Mongoose: MongoDB ODM.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
    handler: String,
    beat: [],
    msg: String,
    created: {type: Date, default: Date.now}
})

var MachineStateSchema = new Schema({
    longUrl: String,
    shortUrl: String,
    created: {type: Date, default: Date.now}
})

var RoomsSchema = new Schema({
    hashtag: String,
    tweets: [],
    created: {type: Date, default: Date.now}
})

mongoose.model('Rooms',RoomsSchema);
mongoose.model('Tweet',TweetSchema);
mongoose.model('MachineState',MachineStateSchema);
