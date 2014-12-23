/**
* Conroller module: Logins with passport Twitter and stores new user.
*/

var mongoose = require('mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mode = require('./model');
var config = require('./config')[process.env.ENVAR || 'dev'];

var User = mongoose.model('User');

passport.use(new TwitterStrategy({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: config.cb_url
},
function(token, tokenSecret, profile, done) {
    User.findOne({uid: profile.id}, function(err, user) {
        if(user) {
            done(null, user);
        } else {
            var user = new User();
            user.provider = "twitter";
            user.uid = profile.id;
            user.name = profile.displayName;
            user.token = token;
            user.tokenSecret = tokenSecret;
            user.image = profile._json.profile_image_url;
            user.save(function(err) {
                if(err) { throw err; }
                    done(null, user);
                });
            }
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
    User.findOne({uid: uid}, function (err, user) {
        done(err, user);
    });
});

var Tweet = mongoose.model('Tweet');

exports.insert = function (tw){
    var tweet = new Tweet();
    tweet.handler = tw.handler;
    tweet.beat = tw.beat;
    tweet.msg = tw.msg;
    tweet.save();
}

exports.getLatestTweets = function(num, cb){
    Tweet.find().sort({'created': -1})
    .limit(num)
    .exec(function(err, tweets) {
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
        cb(err, ms.longUrl)
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
