/**
* Module dependencies: Server Logic
*/
var http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    redis = require('redis'),
    routes = require('./routes'),
    controller = require('./controller'),
    path = require('path'),
    twitter = require('ntwitter'),
    fs = require('fs'),
    colors = require('colors'),
    cluster = require('cluster'),
    config = require('./config')[process.env.ENVAR || 'dev'],
    ioe = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 }),
    redisAdapter = require('socket.io-redis'),
    port = process.env.PORT || 3000,
    workers = process.env.WORKERS || require('os').cpus().length,
    twit = new twitter({
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        access_token_key: config.ac_key,
        access_token_secret: config.ac_secret
    });

mongoose.connect(config.db);

if (cluster.isMaster) {

    var watch = ['#MMODM'];

    twit.verifyCredentials(function (err, data) {
        if(err) console.error(err);
    })
    .stream('statuses/filter', {track:watch}, function(stream) {
        console.log("MMODM - Engine".rainbow);
        console.log("--------------".rainbow);
        console.log("[OK]".bgBlue +" Twitter Stream API, listening.".red);
        stream.on('data', function (data) {
            if (data.text !== undefined) {
                var name = data.user.screen_name;
                var tweet_txt = data.text.split("#");
                var ma = false
                if(tweet_txt[0] != null) ma = tweet_txt[0].match(/\[.*\]/);
                if (ma){
                    var m = ma[0].split("");
                    var keystrokes = m.splice(1,m.length-1);
                    var tweet = {};

                    for (var i=1; i < tweet_txt.length; i++){
                        if("#"+tweet_txt[i] != watch[0]){
                            ioe.emit('keys', {keys:keystrokes,room:tweet_txt[i]});
                        }
                    }
                    if(tweet_txt.length == 2){
                        console.log("[New Tweet]".bgBlue +" "+ data.text);
                        ioe.emit('keys', {keys:keystrokes,room:"MMODM"});
                    }
                    tweet.handler = name;
                    tweet.beat = keystrokes;
                    tweet.msg = tweet_txt[0];
                    controller.insertTweet(tweet, function(err){
                        if(err) console.error(err)
                    });

                }
                else console.warn("Dump.")
                }
            });
            stream.on('error', function (err, code) {
                console.error("err: "+err+" "+code)
            });
        });
        console.log("[OK]".bgMagenta + ' start cluster with %s workers'.red, workers - 1);
        workers--;
        for (var i = 0; i < workers; ++i) {
            var worker = cluster.fork();
            console.log("[OK]".bgMagenta + ' worker %s started.', worker.process.pid);
        }

        cluster.on('death', function(worker) {
            console.log("[NOT-OK]".bgYello + 'worker %s died. restart...', worker.process.pid);
        });

}
else {
    startSlave();
}

// Helpers
function startSlave(){
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    addRedisAdapter(io);
    addIOEventHandlers(io);

    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.session({ secret: config.session_secret }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function (req, res, next) {
        res.header("X-powered-by", "The Force")
        next()
    })
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public'),{ maxAge: 2629800000 }));
    app.use(express.logger());

    //Routes
    app.get('/', routes.index);


    app.get('/save/:longurl', function(req, res){
        controller.saveState(req.params.longurl, function(err, id){
            res.send(id);
        })
    })

    app.get('/sm/:shorturl', function(req, res){
        controller.findState(req.params.shorturl, function(err, longUrl){
            res.redirect('/#'+longUrl);
        })
    })

    app.get('/:room', function(req, res){
        var room  = req.params.room
        res.render('index',{ title: 'MMODM-'+room, room:room })
    })

    app.get('/tws/:num', function(req, res){
        controller.getLatestTweets(req.params.num,function(err, tweets){
            var set = '';
            for(var i=0; i<tweets.length; i++){
                var seq = tweets[i].msg.match(/(\[.*\])/g)[0];
                seq = seq.replace(/o/g,'s')
                seq = seq.replace(/\@.*\s/,"")
                set += seq.substr(1,seq.length-2)
            }
            res.json(set);
        })
    })

    http.listen(port, function() {
        console.log("[OK]".bgYellow + ' server started on port '+port+'. process id = '.red+process.pid);
    });
}

function addRedisAdapter(io) {
    var redisUrl = process.env.REDISTOGO_URL || 'redis://127.0.0.1:6379';
    var redisOptions = require('parse-redis-url')(redis).parse(redisUrl);
    var pub = redis.createClient(redisOptions.port, redisOptions.host, {
        detect_buffers: true,
        auth_pass: redisOptions.password
    });
    var sub = redis.createClient(redisOptions.port, redisOptions.host, {
        detect_buffers: true,
        auth_pass: redisOptions.password
    });

    io.adapter(redisAdapter({
        pubClient: pub,
        subClient: sub
    }));
    console.log("[OK]".bgGreen + ' Redis adapter started with url: '.red + redisUrl);
};

function addIOEventHandlers(io) {
    io.on('connection', function(socket) {
        console.log('Connection made. socket.id='.rainbow +socket.id+' . pid = '+process.pid);
    });
};
