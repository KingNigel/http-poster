'use strict'
var http = require('http');
var url = require('url');

var post = function (uri, content, callback) {
    var urlObj = url.parse(uri);
    var options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        }
    };
    var req = http.request(options, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            callback(null, chunk);
        });
    });
    req.on('error', function (e) {
        // console.log('problem with request: ' + e.message);
        if (e.code == 'ETIMEDOUT') {
            var err = new Error('请求超时！');
            err.code = '100';
            callback(err);
        }
        else {
            var err = new Error('系统异常！');
            err.code = '103';
            callback(err);
        }
    });
    //console.log('content--->: ' + content);
    // write data to request body
    req.write(content);
    req.end();
}
module.exports = post;