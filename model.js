/**
* Model Module: Mongoose: MongoDB ODM.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    provider: String,
    uid: String,
    name: String,
    image: String,
    token: String,
    tokenSecret: String,
    created: {type: Date, default: Date.now}
});

var TweetSchema = new Schema({
    handler: String,
    beat: [],
    msg: String,
    created: {type: Date, default: Date.now}
})

mongoose.model('User',UserSchema);
mongoose.model('Tweet',TweetSchema);
