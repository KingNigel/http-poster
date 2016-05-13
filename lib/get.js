'use strict'
var http = require('http');
var url = require('url');
var get = function (uri, callback) {
    var timeoutEventId;
    var urlObj = url.parse(uri);
    var options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: 'GET'
    };
    var req = http.request(options, function (res) {
        clearTimeout(timeoutEventId);
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
            callback(null, res, chunk);
        });
    });
    req.on('error', function (e) {
        clearTimeout(timeoutEventId);
        if (e.code == 'ETIMEDOUT' || e.code == 'ECONNABORTED' || e.code == 'ECONNRESET') {
            var err = new Error('请求超时！');
            err.code = '100';
            callback(err);
        }
        else if (e.code == 'ECONNREFUSED') {
            var err = new Error('连接被服务器拒绝！');
            err.code = '101';
            callback(err);
        }
        else if (e.code == 'ENOTFOUND') {
            var err = new Error('服务器连接异常！');
            err.code = '102';
            callback(err);
        }
        else {
            var err = new Error('系统异常！');
            err.code = '103';
            callback(err);
            // callback(e);
        }
    });
    req.on('timeout', function (e) {
        if (req.res) {
            req.res('abort');
        }
        req.abort();
    });

    timeoutEventId = setTimeout(function () {
        req.emit('timeout', {message: 'have been timeout...'});
    }, 15000);
    req.end();
}
module.exports=get;