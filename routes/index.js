
/*
 * Das Routes.
 */

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
    twit.verifyCredentials(function (err, data) {
    })
    .updateStatus("#"+req.params.msg+" "+ new Date().getTime(),
    function (err, data) {
        res.send(200);
    }
);
}
