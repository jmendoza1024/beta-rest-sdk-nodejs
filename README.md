# Cybersource APIs Client Library for Node.js

## Description ##
The Cybersource API Client Library enables you to work with Cybersource Rest APIs on your server.

*** Right now this is a Proof-of-Concept SDK, DO NOT USE FOR PRODUCTION, OR EVEN THINK ABOUT IT :-) ***

## Basic Example ##
See the examples/ directory for examples of the key client features.
### Running the example ###
Run the example is as easy as open 'example/app.js' provide credentials (apikey and secretkey)
```JS
npm install
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
    var restClient = new ApiClient(options);
```

### Authorizations (Credit Card) ###
```JS
    var req = {
        authRequest: {
            "amount": "100.00",
            "currency": "USD",
            "referenceId": "123",
            "payment": {
                "cardNumber": "4111111111111111",
                "cardExpirationMonth": "10",
                "cardExpirationYear": "2020"
            }
        }
    };
    restClient
    .authorizePayment(req)
    .then(function(res) {
        console.info("Authorization:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Authorize" + err.message);
    });
```
**Note** : Visa Checkout and Apple Pay, require to be enable before being used.
### Authorizations (Apple Pay) ###
```JS
    var req = {
        authRequest: {
            "amount": "20.99",
            "currency": "USD",
            "payment": {
                "encryptedData": "<blob>”
                "encryptedDescriptor": "<blob>”,
                "encryptedEncoding": "Base64"
            },
            "paymentSolution": "001"
        }

    };
    restClient
    .authorizePayment(req)
    .then(function(res) {
        console.info("Authorization:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Authorize" + err.message);
    });
```

### Authorizations (Visa Checkout) ###
```JS
    var req = {
        authRequest:{
            "amount": "20.99",
            "currency": "USD",
            "payment": {
                "encryptedData": "<blob>"
                "encryptedKey": "<blob>"
            },
            "paymentSolution": "visacheckout",
             "vcOrderId": "<blob>"
        }
    };
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
    restClient
    .capture(req)
    .then(function(res) {
        console.info("Capture:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Authorize" + err.message);
    });
```

### Sales ###
```JS
    var req = {
        AuthCaptureRequest: {
            "amount": "100.00",
            "currency": "USD",
            "referenceId": "123",
            "payment": {
                "cardNumber": "4111111111111111",
                "cardExpirationMonth": "10",
                "cardExpirationYear": "2020"
            }
        }
    };
    restClient
    .sale(req)
    .then(function(res) {
        console.info("Sale:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Sale" + err.message);
    });
```

### Refund ###
```JS
    var req = {
        id: <capture id>,
        refundRequest: {}
    }
    restClient
    .refundCapture(req)
    .then(function(res) {
        console.info("Refund:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Refund" + err.message);
    });
```


### Void a Capture ###
```JS
    var req = {
        id: <capture id>,
        voidRequest: {}
    };
    restClient
    .doCaptureVoid(req);
    .then(function(res) {
        console.info("Void:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to Sale" + err.message);
    });
```

## API Documentation ##
Cybersource: https://devint.vdp.visa.com/products/cybersource/guides
