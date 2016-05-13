# http-poster 一个简单的发送请求的封装
###发送get请求
``` javascript
    var poster=require('http-poster');
    poster.get('你要请求的地址例如',function(err,res,data){ 
       console.log(res);
       console.log(data);
     });
```
###发送post请求
####默认是发送json格式
``` javascript
    var poster=require('http-poster');
    var data={foo:"foo",bar:"bar"};
    var jsonData=JSON.stringify(data);
    poster.post('你要请求的地址例如',jsonData,function(err,data){
       console.log(data);
    });

