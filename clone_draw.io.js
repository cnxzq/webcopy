const open = require('open');
const path = require('path');
const webcopy = require("./webcopy");
webcopy.createService('https://www.draw.io',{
    path:path.join(__dirname,"cache/draw")
},function(url){
    open("http://"+url,["chrome"])
})