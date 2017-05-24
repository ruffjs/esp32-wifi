# ESP32 WiFi

By `esp32-wifi` module, developers can configure WiFi on ESP32. Only station mode is supported now.

## API Refereces

### Methods

- **`start(conf)`**

Start ESP32 WiFi station module to connect to WiFi AP with `conf`, which is an object with `ssid` and `password` properties.

### Event

- **'start'**

Emitted when the ESP32 WiFi station module has been started. The `callback` has no parameters.

- **'disconnect'**

Emitted when the ESP32 WiFi station module is disconnected from WiFi AP. The `callback` has no parameters.

- **'connect'**

Emitted when the ESP32 WiFi station module is connected to WiFi AP. The `callback` has no parameters.

- **'ip'**

Emitted when the ESP32 gets IP from connected WiFi AP. The `callback` has one parameter `ip`, which is an object with `ip`, `mask` and `gw` properties. They are ip address, net mask and gateway address respectively.

## Examples

```javascript
var wifi = require('esp32-wifi');

var conf = {
    'ssid': 'your-ssid',
    'password': 'your-password'
};

wifi.start(conf);

wifi.on('ip', function (ip) {
    console.log('ip address: ' + ip.ip);
    console.log('net mask: ' + ip.mask);
    console.log('gateway address: ' + ip.gw);
});
```
