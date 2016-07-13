var passport = require('passport'),
    CustomStrategy = require('passport-custom').Strategy,
    https = require('https'),
    CacheService = require('../api/services/CacheService');


function verify(token, callback) {
    var options = {
        host: "login2.datasektionen.se",
        path: "/verify/" + token + ".json?api_key=" + process.env.LOGIN2_KEY,
        method: "GET"
    };

    var requestCallback = function(res) {
        var collectedData = "";
        res.setEncoding("utf-8");

        res.on("data", function(data) {
            collectedData += data;
        });

        res.on("end", function() {
            if (collectedData) {
                try {
                    var user = JSON.parse(collectedData);
                    callback(user);
                } catch(e) {
                    callback(undefined);
                }
            } else {
                callback(undefined);
            }
        });

        res.on("error", function() {
            callback(undefined);
        });
    };
    var request = https.request(options, requestCallback);
    request.end();
}

passport.serializeUser(function (user, done) {
    CacheService.addUser(user);
    done(null, user.user);
});

passport.deserializeUser(function (id, done) {
    done(null, CacheService.getUser(id));
});

passport.use('dauth', new CustomStrategy(
    function(req, done) {
        var token = req.params.token;
        verify(token, function(user) {
            if(!user) {
                return done(null, false, { message: 'No user'});
            } else {
                return done(null, user);
            }
        });
    }
));
