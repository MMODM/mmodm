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
                        console.log("[New Tweet] ".bgBlue +" from: @"+ name + data.text);
                        ioe.emit('keys', {keys:keystrokes,room:"MMODM"});
                    }
                    tweet.handler = name;
                    tweet.beat = keystrokes;
                    tweet.msg = tweet_txt[0];
                    controller.insertTweet(tweet, function(err){
                        if(err) console.error(err)
                    });

                }
                else console.error("314: bad tweet ".red + JSON.stringify(data))
                }
            });
            stream.on('error', function (err) {
                console.error("315: Twitter stream error ".red + err);
            });
            stream.on('end', function (message) {
                console.log("316: Twitter stream end ".red + message);
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
    app.use(express.errorHandler())

    //Routes
    app.get('/', routes.index);
    app.get('/save/:longurl', routes.longURL);
    app.get('/sm/:shorturl', routes.shortURL);
    app.get('/:room', routes.room);
    app.get('/tws/:num', routes.getLatestTweets);

    // Handle 404
    app.use(function(req, res) {
        res.send('404: Sometimes things are lost and never found.\t I see you '+req.connection.remoteAddress, 404);
     });

     // Handle 500
    app.use(function(error, req, res, next) {
        res.send('500: Something is jammed: ', 500);
        console.error("500: Internal Server Error ".red + "\t client ip: "+ req.connection.remoteAddress + "\n" + error);
    });

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
