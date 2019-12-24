const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const httpProxy = require('http-proxy');
const zlib = require('zlib');
const filenamedao = require('./lib/filename');

//递归创建目录 异步方法,返回 promise 对象
function mkdirs(dirname) {
    var salf = arguments.callee;
    return fs.promises.mkdir(dirname)
    .catch(err=>{
        return err.code == "EEXIST"?dirname
        :salf(path.dirname(dirname))
        .then(()=>fs.promises.mkdir(dirname))
    })
} 

module.exports.createService = function(target,option,callback){
    if(typeof option == "function"){
        callback = option;
        option = null;
    }
    var option = Object.assign({
        changeOrigin: true,
        target: target,
        path:path.join(__dirname,"cache"),
        port:8888
    },option)
    
    //保存的根目录
    let saveDir = option.path;
    //创建一个代理服务
    const proxy = httpProxy.createProxyServer({
        changeOrigin:option.changeOrigin,
        target:option.target
    });

    proxy.on('proxyRes', function(proxyRes, req, res, options) {
        var pathname = url.parse(req.url).pathname;
        let filename =path.join(saveDir,filenamedao.encode(pathname));
        if(proxyRes.statusCode == 200){
            if(fs.existsSync(filename)){return}
            var body = [];
            proxyRes.on('data', function (chunk) {
                body.push(chunk);
            });
            proxyRes.on('end', function () {
                body = Buffer.concat(body);
                Promise.all([
                    proxyRes.headers["content-encoding"]==="gzip"
                    ?new Promise(
                        (resolve,reject)=>zlib.gunzip(
                            body,
                            (err,data)=>err?reject(err):resolve(data)
                        )
                    )
                    :Promise.resolve(body),
                    mkdirs(path.dirname(filename))
                ]).then(datas=>{
                    return fs.promises.writeFile(filename,datas[0])
                })
                .then(_=>console.log("写入完成:"+filename))
                .catch(err=>console.log(err));
            });
        }
    });
    //监听代理服务错误
    proxy.on('error', function (err) {
        console.log(err);
    });
    //创建http服务器并监听8888端口
    let server = http.createServer(function (req, res) {
        //将用户的请求转发到本地9999端口上
        proxy.web(req, res, option);
    });
    
    server.listen(option.port, '0.0.0.0',function(){
        console.log("started:"+option.port)
        callback&&callback.call(server,"localhost:"+option.port);
    });
}