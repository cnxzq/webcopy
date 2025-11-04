const open = require('open');
const path = require('path');
const webcopy = require("./webcopy");
webcopy.createService('https://admin.gatesstsuperlaser.com',{
    path:path.join(__dirname,"cache/gatesstsuperlaser")
},function(url){
    open("http://"+url,["chrome"])
})