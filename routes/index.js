
/*
 * Das Routes.
 */

var config = require('../config')[process.env.ENVAR || 'dev'];
var twitter = require('ntwitter');

function makeTweet(req,cb) {

    if (!req.user.token) {
        console.warn("Must Loggin first.");
    }
    else{
        var twit = new twitter({
            consumer_key: config.consumer_key,
            consumer_secret: config.consumer_secret,
            access_token_key: req.user.token,
            access_token_secret: req.user.tokenSecret
        });
        twit
        .verifyCredentials(function (err, data) {
            if(err) console.error(err);
        })
        .updateStatus(req.params.msg,
            function (err, data) {
                if(err)
                    console.error(err)
            }
        );

    }
}
exports.index = function(req, res){
    
  res.render('index', { title: 'MMODM', user: req.user });
};


exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
}

exports.auth_cb = function(req, res) {
    res.redirect('/');
}

exports.auth = function(req, res){
        // The request will be redirected to Twitter for authentication, so this
        // function will not be called.
}

exports.tweet = function(req, res){
    makeTweet(req,function(err, data){
        if(err)
            console.error(err)
        else{
            res.send(200)
        }

    })
}
