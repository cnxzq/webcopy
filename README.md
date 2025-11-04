# webcopy

## install

```bash
npm install webcopy
```

## example

```js
const open = require('open');
const path = require('path');
const webcopy = require("./webcopy");
webcopy.createService('http://ramda.cn/',{
    path:path.join(__dirname,"cache/ramda")
},function(url){
    open("http://"+url,["chrome"])
})
```

## clone 网站

* 例如 abc.com
* 新建 clone_abc_com.js
* 启动代理服务
* 在浏览器中将相关页面点击一遍
