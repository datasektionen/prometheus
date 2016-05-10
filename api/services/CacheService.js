// CacheService.js

var kthIdCache = {};
var roleCache = {};

module.exports = {

    addUser: function (user) {
        kthIdCache[user.user] = user;
    },

    getUser: function (user) {
        if (typeof kthIdCache[user] !== "undefined")
            return kthIdCache[user];
        else
            return { first_name: "", last_name: "", emails: user + "@kth.se", user: user, ugkthid: "" }
    }

};