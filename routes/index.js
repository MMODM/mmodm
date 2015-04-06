/*
 * Das Routes.
 */

var controller = require('../controller');

exports.index = function(req, res){

  res.render('index', { title: 'MMODM'});
};

exports.longURL = function(req, res){
    controller.saveState(req.params.longurl, function(err, id){
        if(err)
            res.send('404: Sometimes things are lost and never found.\t I see you '+req.connection.remoteAddress, 404);
        else
            res.send(id);
    })
}

exports.shortURL = function(req, res){
    controller.findState(req.params.shorturl, function(err, longUrl){
        if(err)
            res.send('404: Sometimes things are lost and never found.\t I see you '+req.connection.remoteAddress, 404);
        else
            res.redirect('/#'+longUrl);
    })
}

exports.room = function(req, res){
    var room  = req.params.room
    res.render('index',{ title: 'MMODM-'+room, room:room })
}

exports.getLatestTweets = function(req, res){
    controller.getLatestTweets(req.params.num,function(err, tweets){
        if(err)
            res.send('404: Sometimes things are lost and never found.\t I see you '+req.connection.remoteAddress, 404);
        else{
            var set = '';
            for(var i=0; i<tweets.length; i++){
                var seq = tweets[i].msg.match(/(\[.*\])/g)[0];
                seq = seq.replace(/o/g,'s')
                seq = seq.replace(/\@.*\s/,"")
                set += seq.substr(1,seq.length-2)
            }
            res.json(set);
        }
    })
}
