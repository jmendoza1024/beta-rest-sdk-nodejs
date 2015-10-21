/*jshint -W069 */
/**
 * Payments Rest API
 * @class ApiClient
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ApiClient = (function() {
    'use strict';

    var request = require('request');
    var tokenUtils = require('./securityUtils').TokenUtils;
    var $q = require('q');

    function ApiClient(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'http://sl73sndbxapd120.visa.com:8080/';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.opts = options;
        if (!this.opts || !this.opts.apikey || !this.opts.secretKey) {
            throw new Error(" 'apikey' and 'secretKey' must be specified.");
        }
    }

    /**
     * Set Token
     * @method
     * @name ApiClient#setToken
     * @param {string} value - token's value
     * @param {string} headerOrQueryName - the header or query name to send the token at
     * @param {boolean} isQuery - true if send the token as query param, otherwise, send as header param
     *
     */
    ApiClient.prototype.setToken = function(value, headerOrQueryName, isQuery) {
        this.token.value = value;
        this.token.headerOrQueryName = headerOrQueryName;
        this.token.isQuery = isQuery;
    };

    /**
     * Transaction search
     * @method
     * @name ApiClient#searchPayment
     * @param {integer} offset - This paging parameter is used to specify the page number.
     * @param {integer} limit - This paging parameter is used to specify the page size, i.e. number of records.
     * @param {} searchRequest - Search transaction request 
     * 
     */
    ApiClient.prototype.searchPayment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/search';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['searchRequest'] !== undefined) {
            body = parameters['searchRequest'];
        }

        if (parameters['searchRequest'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: searchRequest'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The payments endpoint returns information about your submitted payments. The response includes transaction details.
     * @method
     * @name ApiClient#getPayment
     * @param {string} id - transaction id
     * 
     */
    ApiClient.prototype.getPayment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/search/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Create an authorized payment
     * @method
     * @name ApiClient#authorizePayment
     * @param {} authRequest - Authorize a payment
     * 
     */
    ApiClient.prototype.authorizePayment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/authorizations';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['authRequest'] !== undefined) {
            body = parameters['authRequest'];
        }

        if (parameters['authRequest'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: authRequest'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for all authorizations
     * @method
     * @name ApiClient#findAuthorizations
     * @param {integer} offset - This paging parameter is used to specify the page number.
     * @param {integer} limit - This paging parameter is used to specify the page size, i.e. number of records.
     * 
     */
    ApiClient.prototype.findAuthorizations = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/authorizations';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for authorization given an id
     * @method
     * @name ApiClient#findAuthorization
     * @param {string} id - authorization id
     * 
     */
    ApiClient.prototype.findAuthorization = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/authorizations/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Perform a sale
     * @method
     * @name ApiClient#sale
     * @param {} AuthCaptureRequest - Perform a sale
     * 
     */
    ApiClient.prototype.sale = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/sales';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['AuthCaptureRequest'] !== undefined) {
            body = parameters['AuthCaptureRequest'];
        }

        if (parameters['AuthCaptureRequest'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: AuthCaptureRequest'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for all sales
     * @method
     * @name ApiClient#findSales
     * @param {integer} offset - Element number
     * @param {integer} limit - Page size
     * 
     */
    ApiClient.prototype.findSales = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/sales';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for sale given an id
     * @method
     * @name ApiClient#findSale
     * @param {string} id - Search for sale given an id
     * 
     */
    ApiClient.prototype.findSale = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/sales/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Capture against a payment against an authorization id
     * @method
     * @name ApiClient#capture
     * @param {string} id - authorize transaction id
     * @param {} captureRequest - Capture request data
     * 
     */
    ApiClient.prototype.capture = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/authorizations/{id}/captures';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['captureRequest'] !== undefined) {
            body = parameters['captureRequest'];
        }

        if (parameters['captureRequest'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: captureRequest'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for all captures against an authorization id
     * @method
     * @name ApiClient#findAuthorizationCaptures
     * @param {string} id - authorization transaction id
     * @param {integer} offset - This paging parameter is used to specify the page number.
     * @param {integer} limit - This paging parameter is used to specify the page size, i.e. number of records.
     * 
     */
    ApiClient.prototype.findAuthorizationCaptures = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/authorizations/{id}/captures';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for capture given an id 
     * @method
     * @name ApiClient#getCapture
     * @param {string} id - authorization transaction id
     * 
     */
    ApiClient.prototype.getCapture = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/captures/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Search for all captures in a paginated basis 
     * @method
     * @name ApiClient#findCaptures
     * @param {integer} offset - Element number
     * @param {integer} limit - Page size
     * 
     */
    ApiClient.prototype.findCaptures = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/captures';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a refund for a particular capture
     * @method
     * @name ApiClient#refundCapture
     * @param {string} id - ID of the capture to refund
     * @param {} refundRequest - Capture request data
     * 
     */
    ApiClient.prototype.refundCapture = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/captures/{id}/refunds';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['refundRequest'] !== undefined) {
            body = parameters['refundRequest'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Returns a list of refunds for a particular capture transaction
     * @method
     * @name ApiClient#listCaptureRefunds
     * @param {string} captureId - The ID of the capture to refund
     * @param {integer} offset - offset
     * @param {integer} limit - limit
     * 
     */
    ApiClient.prototype.listCaptureRefunds = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/captures/{id}/refunds';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{captureId}', parameters['captureId']);

        if (parameters['captureId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: captureId'));
            return deferred.promise;
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a refund for a particular sale
     * @method
     * @name ApiClient#refundSale
     * @param {string} id - ID of the sale to refund
     * @param {} refundRequest - sale request data
     * 
     */
    ApiClient.prototype.refundSale = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/sales/{id}/refunds';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['refundRequest'] !== undefined) {
            body = parameters['refundRequest'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Returns a list of refunds for a particular sale transaction
     * @method
     * @name ApiClient#listSaleRefunds
     * @param {string} saleId - The ID of the sale to refund
     * @param {integer} offset - offset
     * @param {integer} limit - limit
     * 
     */
    ApiClient.prototype.listSaleRefunds = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/sales/{id}/refunds';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{saleId}', parameters['saleId']);

        if (parameters['saleId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: saleId'));
            return deferred.promise;
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists successful refunds
     * @method
     * @name ApiClient#listRefunds
     * @param {integer} offset - offset
     * @param {integer} limit - limit
     * 
     */
    ApiClient.prototype.listRefunds = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/refunds';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves a refund by ID
     * @method
     * @name ApiClient#getRefund
     * @param {string} id - The ID of the refund
     * 
     */
    ApiClient.prototype.getRefund = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/refunds/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name ApiClient#doCaptureVoid
     * @param {string} id - Capture transaction id
     * @param {} voidRequest - Void request data
     * 
     */
    ApiClient.prototype.doCaptureVoid = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/captures/{id}/voids';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['voidRequest'] !== undefined) {
            body = parameters['voidRequest'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name ApiClient#doRefundVoid
     * @param {string} id - Refund transaction id
     * @param {} voidRequest - Void request data
     * 
     */
    ApiClient.prototype.doRefundVoid = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/refunds/{id}/voids';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['voidRequest'] !== undefined) {
            body = parameters['voidRequest'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name ApiClient#doSaleVoid
     * @param {string} id - Sales transaction id
     * @param {} voidRequest - Void request data
     * 
     */
    ApiClient.prototype.doSaleVoid = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/sales/{id}/voids';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['voidRequest'] !== undefined) {
            body = parameters['voidRequest'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name ApiClient#getVoid
     * @param {string} id - Unique identifier for the transaction
     * 
     */
    ApiClient.prototype.getVoid = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/voids/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a new Credit
     * @method
     * @name ApiClient#postCredit
     * @param {} creditRequest - credit request data
     * 
     */
    ApiClient.prototype.postCredit = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/credits';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['creditRequest'] !== undefined) {
            body = parameters['creditRequest'];
        }

        if (parameters['creditRequest'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: creditRequest'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name ApiClient#getCredits
     * @param {integer} offset - offset
     * @param {integer} limit - limit
     * 
     */
    ApiClient.prototype.getCredits = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/credits';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name ApiClient#findCredit
     * @param {string} id - Unique identifier for the transaction
     * 
     */
    ApiClient.prototype.findCredit = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/credits/{id}';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Void a credit
     * @method
     * @name ApiClient#doCreditVoid
     * @param {string} id - creditId
     * @param {} voidRequest - Void request data
     * 
     */
    ApiClient.prototype.doCreditVoid = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/payments/v1/credits/{id}/voids';

        var body;
        var apikey = this.opts.apikey;
        var queryParameters = {
            apikey: apikey
        };
        var headers = {
            accept: '*/*'
        };
        var form = {};

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['voidRequest'] !== undefined) {
            body = parameters['voidRequest'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        headers['x-pay-token'] = tokenUtils.generateTokenSync(this.opts.apikey, this.opts.secretKey, path, queryParameters, body);

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };

    return ApiClient;
})();

module.exports = ApiClient;