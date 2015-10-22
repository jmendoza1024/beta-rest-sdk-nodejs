# Cybersource APIs Client Library for Node.js

## Description ##
The Cybersource API Client Library enables you to work with Cybersource Rest APIs on your server.

## Basic Example ##
See the examples/ directory for examples of the key client features.
### Running the example ###
Run the example is as easy as open 'example/app.js' provide credentials (apikey and secretkey)
```JS
node example/app.js
```

### Configuration ###
```JS
    var ApiClient = require('beta-rest-sdk-nodejs');
    var options = {
        apikey: '<apikey>', //replace with your apikey
        secretKey: '<secretkey>', //replace with your secrekey
        domain: 'https://sandbox.api.visa.com/cybersource' //url
    };
```
### Authorization ###
```JS
    var restClient = new ApiClient(options);
    restClient
    .authorizePayment(req)
    .then(function(res) {
        console.info("Authorization:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Authorize" + err.message);
    });
```

### Capture ###
```JS

    var req = {
        id: <authorization id>,
        captureRequest: {
            amount: "100.00"
        }
    }
    var restClient = new ApiClient(options);
    restClient
    .capture(req)
    .then(function(res) {
        console.info("Capture:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Authorize" + err.message);
    });
```

## Documentation ##
Cybersource: https://devint.vdp.visa.com/products/cybersource/guides
