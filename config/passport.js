var passport = require('passport'),
    CustomStrategy = require('passport-custom').Strategy,
    fetch = require('node-fetch'),
    CacheService = require('../api/services/CacheService');

passport.serializeUser(function (user, done) {
    CacheService.addUser(user);
    done(null, user.user);
});

passport.deserializeUser(function (id, done) {
    done(null, CacheService.getUser(id));
});

passport.use('dauth', new CustomStrategy(

    function(req, done) {
        var login = {
            host: "https://login2.datasektionen.se",
            path: "/verify/" + req.params.token + ".json?api_key=" + process.env.LOGIN2_KEY
        }

        fetch(login.host + login.path)
        .then(res => res.json())
        .then(user => {
            var pls = {
                host: 'https://pls.datasektionen.se',
                path: '/api/user/' + user.user + '/prometheus'
            }
            fetch(pls.host + pls.path)
            .then(res => res.json())
            .then(permissions => {
                if(permissions.length)
                    done(null, Object.assign({}, user, {permissions}))
                else
                    done(null, false, { message: 'No permissions'})
            })
        })
    }
));
