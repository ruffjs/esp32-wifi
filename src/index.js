'use strict'

// This module is only for ESP32 WiFi

function Wifi() {
    this._handle = ruff.wifi;
    this._obj = this._handle.new();

    this._events = {
        'start': this._handle.EID_STA_START,
        'connect': this._handle.EID_STA_CONNECT,
        'disconnect': this._handle.EID_STA_DISCONNECT,
        'ip': this._handle.EID_STA_GOTIP
    };
    this._eventNum = Object.keys(this._events).length;
    this._eventCbs = new Array(this._eventNum);

    this._ral = ruff.ral;
    this._ralName = "wifi";

    this._eventDispatcher = eventDispatcher;
};

var eventDispatcher = function (obj) {
    var that = obj;
    // get eventId first
    var eventId = that._handle.getEID(that._obj);
    if (eventId < 0 || eventId >= that._eventNum) {
        console.log('Invalid eventId `' + eventId + '`, should be [0,' + that._eventNum + ']');
    }

    // if corresponding event callback is not registered, just skip
    if (that._eventCbs[eventId] === undefined) {
        return;
    }

    switch (eventId) {
        case that._handle.EID_STA_START:
            that._eventCbs[that._handle.EID_STA_START]();
            break;
        case that._handle.EID_STA_CONNECT:
            that._eventCbs[that._handle.EID_STA_CONNECT]();
            break;
        case that._handle.EID_STA_DISCONNECT:
            that._eventCbs[that._handle.EID_STA_DISCONNECT]();
            break;
        case that._handle.EID_STA_GOTIP:
            // get eventId corresponding data if needed
            var ip = that._handle.getIP();
            that._eventCbs[that._handle.EID_STA_GOTIP](ip);
            that.stop();
            break;
        default:
            break;
    }

};


Wifi.prototype.start = function (conf) {
    // register itself to RAL
    this._ral.register(this._ralName, this._eventDispatcher, this);
    // start its own logic
    this._handle.start(this._obj, conf);
};

Wifi.prototype.on = function (event, callback) {
    if (!this._events.hasOwnProperty(event)) {
        console.log('Invalid event `' + event  + '`');
        return;
    }

    // get eventId from event and store callback
    var eventId = this._events[event];
    this._eventCbs[eventId] = callback;
};

Wifi.prototype.stop = function () {
    // unregister itself from RAL and stop
    this._ral.unregister(this._ralName);
    // free wifi handle
    this._handle.stop(this._obj);
};

module.exports = new Wifi();
