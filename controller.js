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

    Tweet.find().sort('-created').limit(num).exec(function(err,tweets){
        cb(err,tweets);
        if(err)
            console.error('510: Database error - Save State ' + err)
        if(!tweets)
            console.error('410: can\'t find Tweet')
    });
}
var MachineState = mongoose.model('MachineState');

exports.saveState = function(url, cb){
    var ms = new MachineState();
    ms.longUrl = url;
    ms.shortUrl = Math.random().toString(36).slice(2).substr(2,8);
    ms.save(function(err){
        cb(err,ms.shortUrl);
        if(err)
            console.error('510: Database error - Save State ' + err)
    });
}

exports.findState = function(short, cb){
    MachineState.findOne({shortUrl: short}, function(err, ms) {
        if(ms != null)
            cb(err, ms.longUrl)
        if(err){
            console.error('511: Database error - Machine State ' + err)
            cb(err, '');
        }
        if(!ms){
            console.error('411: can\'t find machine state ')
            cb('can\'t find machien state', '');
        }
    })
}

var Rooms = mongoose.model('Rooms');

exports.createRoom = function(hashtag, cb){
    var rm = new Room();
    rm.hashtag = hashtag;
    rm.save(function(err){
        cb(err,rm.hashtag);
        if(err)
            console.error('512: Database error - Rooms ' + err)
    });
}
