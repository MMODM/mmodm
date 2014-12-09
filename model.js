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
    created: {type: Date, default: Date.now}
});


mongoose.model('User',UserSchema);
