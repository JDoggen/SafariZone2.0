"use strict";
exports.__esModule = true;
var q = require("q");
var path = require("path");
var fs = require("fs");
//import {red} from 'colors';
var SafariZone = /** @class */ (function () {
    function SafariZone() {
        var _this = this;
        console.log("\x1b[43m\x1b[36m%s\x1b[0m", "Started SafariZone");
        console.log("Booting...");
        this.readConfig()
            .then(function (config) {
            _this.config = config;
        });
    }
    SafariZone.prototype.readConfig = function () {
        console.log("Reading config...");
        var defer = q.defer();
        var configPath = path.join('.', "config.json");
        fs.readFile(configPath, "utf-8", function (err, data) {
            if (!err) {
                var config = JSON.parse(data);
                console.log('Config succesfully read');
                defer.resolve(config);
            }
            else {
                console.log('Error whilest reading config file');
                defer.reject(err);
            }
        });
        return defer.promise;
    };
    return SafariZone;
}());
exports.SafariZone = SafariZone;
