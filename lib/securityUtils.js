var crypto = require('crypto');
var Q = require('q');
var jsonSafeStringify = require('json-stringify-safe');

function getTimestamp(){
    return Math.floor(Date.now() / 1000);
}

function safeStringify (obj) {
  var ret
  try {
    ret = JSON.stringify(obj)
  } catch (e) {
    ret = jsonSafeStringify(obj)
  }
  return ret
}

function getStrToSign(apikey, secretKey, timestamp, resource,params, payload) {
    if(payload && (typeof payload === 'object')) {
        payload = safeStringify(payload);
    } else {
        payload = '';
    }
    
    var strParam = '';
    if(params && (typeof params === 'object')) {
        var paramArray = [];
        for(var i in params) {
            paramArray.push(i);
        }
        if(paramArray.length > 0) {
            paramArray.sort();
            for(var i in paramArray) {
                var key   = paramArray[i];
                var value = params[key];
                strParam += '&' + key + '=' + value;
            }
            strParam = strParam.substr(1);
        }
    }
    resource = resource.substr(1);
    return secretKey + timestamp + resource + strParam + payload ; 
}

function getDigest(strToSign) {
    var hash = crypto.createHash('sha256');
    hash.update(strToSign);
    var value = hash.digest('hex');
    return value.toLowerCase();
}

exports.TokenUtils = {
    generateTokenSync: function(apikey, secretKey, resource,params, payload){
        var timestamp = getTimestamp();
        var strToSign = getStrToSign(apikey, secretKey,timestamp, resource,params, payload);
        var hash = getDigest(strToSign);
        var token = "x:" + timestamp + ":" + hash;
        
        return token;
    }, 
    generateToken : function(apikey, secretKey, resource,params, payload){
        var deferred = Q.defer();
        var self = this;
        process.nextTick(function(){
            var token = self.generateTokenSync(apikey, secretKey, resource,params, payload);
            if(token == null) {
                deferred.reject(null);
            } else {
                deferred.resolve(token);
            }
        });
        return deferred.promise;
    }
};