//
const express=require('express');
//引入body-parser中间件
const bodyParser=require('body-parser');
//引入用户路由器
const userRouter=require('./routes/user.js');
//创建web服务器
var app=express();
//监听端口8080;
app.listen(8080);
//托管静态资源到public,创建注册网页user_reg.html
app.use( express.static('public') );
//使用body-parser中间件
app.use(bodyParser.urlencoded({
	extended:false
}));
//使用路由器，并挂载到/user下
app.use('/user',userRouter);