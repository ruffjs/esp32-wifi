'use strict'

// This module is only for ESP32 WiFi

function WifiConf () {
    this._handle = ruff.wificonf;
    this._obj = this._handle.new_wificonf();
}

// TODO: support start(conf[, callback])

WifiConf.prototype.start = function (conf) {
    if (!this._obj) {
        throw new Error('No wificonf object');
    }

    if (typeof conf !== 'object') {
        throw new Error('Invalid parameter type');
    }

    var that = this;
    process.nextTick(function () {
        that._handle.wificonf_start(that._obj, conf);
    });
};

WifiConf.prototype.on = function (event, callback) {
    if (event === 'connect') {
        var that = this;
        this._handle.on(this._obj, function (ip) {
            callback(ip);
            that._handle.wificonf_stop(that._obj);
            that._obj = null;
        });
    }
};

module.exports = new WifiConf();
