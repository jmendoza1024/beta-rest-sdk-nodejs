//import node sdk
var ApiClient = require('../apiClient.js');

//ignore self-signed certificate.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//configuration parameters
var options = {
    apikey: '<apikey>', //replace with your apikey
    secretKey: '<secretkey>', //replace with your secrekey
    domain: 'https://sandbox.api.visa.com/cybersource' //sandbox url
};

//creates an instance of the client
var restClient = new ApiClient(options);

//sample data
var req = {
    authRequest: {
        "amount": "100.00",
        "currency": "USD",
        "referenceId": "123",
        "payment": {
            "cardNumber": "4111111111111111",
            "cardExpirationMonth": "10",
            "cardExpirationYear": "2016"
        }
    }
};
// authorize, capture and void.
restClient
    .authorizePayment(req)
    .then(function(res) {
        console.info("Authorize:" + JSON.stringify(res.body) + '\n\n\n');
        var req = {
            id: res.body.id,
            captureRequest: {
                amount: "100.00"
            }
        }
        return restClient.capture(req);
    }, function(err) {
        console.error("Failed to call 'authorizePayment' " + JSON.stringify(err));
    })
    .then(function(res) {
        console.info("Capture:" + JSON.stringify(res.body) + '\n\n\n');
        var req = {
            id: res.body.id,
            voidRequest: {}
        };
        return restClient.doCaptureVoid(req);
    }, function(err) {
        console.error("Failed to call 'capture' " + JSON.stringify(err) + '\n\n\n');
    })
    .then(function(res) {
        console.info("Transaction voided:" + JSON.stringify(res.body));
    }, function(err) {
        console.error("Failed to call 'void' " + JSON.stringify(err));
    });
	
