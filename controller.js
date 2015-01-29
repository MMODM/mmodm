/**
* Conroller module: Logins with passport Twitter and stores new user.
*/

var mongoose = require('mongoose');
var mode = require('./model');
var config = require('./config')[process.env.ENVAR || 'dev'];

var Tweet = mongoose.model('Tweet');

exports.insertTweet = function (tw, cb){

    var tweet = new Tweet();
    tweet.handler = tw.handler;
    tweet.beat = tw.beat;
    tweet.msg = tw.msg;
    tweet.save(function(err){
        if(err) cb(err)
    });
}

exports.getLatestTweets = function(num, cb){
    Tweet.find().sort('-created').limit(5).exec(function(err,tweets){
        cb(err,tweets);
    });
}
var MachineState = mongoose.model('MachineState');

exports.saveState = function(url, cb){
    var ms = new MachineState();
    ms.longUrl = url;
    ms.shortUrl = Math.random().toString(36).slice(2).substr(2,8);
    ms.save(function(err){
        cb(err,ms.shortUrl);
    });
}

exports.findState = function(short, cb){
    MachineState.findOne({shortUrl: short}, function(err, ms) {
        if(err) console.log(err)
        else cb(err, ms.longUrl)
    })
}

var Rooms = mongoose.model('Rooms');

exports.createRoom = function(hashtag, cb){
    var rm = new Room();
    rm.hashtag = hashtag;
    rm.save(function(err){
        cb(err,rm.hashtag);
    });
}
