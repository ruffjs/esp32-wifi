'use strict'

// This module is only for ESP32 WiFi

function Wifi() {
    this._handle = ruff.wifi;
    this._obj = this._handle.new();

    this._events = {
        'connect': this._handle.EID_STA_CONNECT,
        'disconect': this._handle.EID_STA_DISCONNECT,
        'ip': this._handle.EID_STA_GOTIP
    };
    this._eventNum = Object.keys(this._events).length;
    this._eventCbs = new Array(this._eventNum);

    this._ral = ruff.ral;
    this._ralName = "wifi";
}

var eventDispatcher = function () {
    // get eventId first
    var eventId = this._wifi.getEID();
    if (eventId < 0 || eventId >= this._eventNum) {
        console.log('Invalid eventId `' + eventId + '`, should be [0,' + this._eventNum + ']');
    }

    // if corresponding event callback is not registered, just skip
    if (this._callbacks[eventId] === undefined) {
        return;
    }

    switch (eventId) {
        case this._wifi.EID_STA_CONNECT:
            this._eventCbs[this._wifi.EID_STA_CONNECT]();
            break;
        case this._wifi.EID_STA_DISCONNECT:
            this._eventCbs[this._wifi.EID_STA_DISCONNECT]();
            break;
        case this._wifi.EID_STA_GOTIP:
            // get eventId corresponding data if needed
            var ip = this._wifi.getIP();
            this._eventCbs[this._wifi.EID_STA_GOTIP](ip);
            break;
        default:
            break;
    }
};

Wifi.prototype.start = function (conf) {
    // register itself to RAL
    this._ral.register(this._ralName, eventDispatcher);
    // start RAL uv module
    this._ral.start();
    // start its own logic
    this._handle.start(this._obj, conf);
};

Wifi.prototype.on = function (event, callback) {
    if (!this._events.hasProperty(event)) {
        console.log('Invalid event `' + event  + '`');
        return;
    }

    // get eventId from event and store callback
    var eventId = this._wifiEvents[event];
    this._eventCbs[eventId] = callback;
};

Wifi.prototype.stop = function () {
    // unregister itself from RAL and stop
    this._ral.unregister(this._ralName);
    // stop RAL uv module
    this._ral.stop();
    // free wifi handle
    this._handle.stop(this._obj);
};

module.exports = new Wifi();
