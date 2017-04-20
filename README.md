# ESP32 WiFi

By `esp32-wifi` module, developers can configure WiFi on ESP32. Station mode is supported only now.

## API Refereces

### Methods

- **`start(conf)`**

Start to connect to WiFi AP with `conf`, which is an object with `ssid` and `password` properties. 

### Event

- **'connect'**

Emitted when the connection is successfully established. The `callback` has one parameter `ip`, which is an object with `ip`, `mask` and `gw` properties. They are ip address, net mask and gateway address respectively.

## Examples

```javascript
var wifi = require('esp32-wifi');

var conf = {
    'ssid': 'your-ssid',
    'password': 'your-password'
};

wifi.start(conf);

wifi.on('connect', function (ip) {
    console.log('ip address: ' + ip.ip);
    console.log('net mask: ' + ip.mask);
    console.log('gateway address: ' + ip.gw);
});
```
