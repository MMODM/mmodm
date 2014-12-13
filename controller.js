/**
* Conroller module: Logins with passport Twitter and stores new user.
*/

var mongoose = require('mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mode = require('./model');
var config = require('./config');

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
