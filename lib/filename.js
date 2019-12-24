const path = require("path");
module.exports.encode = function(filename){
    var url = filename.split("/");
    if(path.extname(url[url.length-1])){
        return filename;
    }else{
        url[url.length-1]=encodeURIComponent(url[url.length-1])
        if(url[url.length-1]==""){
            url[url.length-1]+="index.html"
        }else{
            url[url.length-1]+=".html"
        }
        return url.join("/");
    }
}
module.exports.decode = function(filename){
    var url = filename.split("/");
    if(path.extname(url[url.length-1])){
        return filename;
    }else{
        url[url.length-1]=decodeURIComponent(url[url.length-1])
        return url.join("/");
    }
}