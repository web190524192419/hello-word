//引入express模块
const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//添加路由
//1.注册路由
router.post('/reg',function(req,res){
	//1.1获取post请求的数据
	var obj=req.body;
	//1.2验证每一项是否为空  如果用户名为空   //if(!obj.uname)
	if(obj.uname===''){
		res.send({code:401,msg:'名字不能为空'});
		return;
	};
		if(!obj.upwd){
		res.send({code:402,msg:'请输入正确的密码'});
		return;
	};
	if(!obj.phone){
		res.send({code:403,msg:'请填写正确的电话号码'});
		return;
	};
	if(!obj.email){
		res.send({code:404,msg:'请输入正确的邮箱，别想糊弄过去'});
		return;
	};
	//1.3执行SQL语句
	pool.query('insert into xz_user set ?',[obj],function(err,result){
		if(err)throw err;
		//console.log(result);
		//如果数据插入成功>0
		if(result.affectedRows>0){
			res.send({code:200,msg:'reg suc'});
		}
	});
	//结束函数执行
});


//2.登录路由
router.post('/login',function(req,res){
	//2.1:使用body获取post请求
	var obj=req.body;
	//2.2:验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'用户名或密码错误'});
		return;
	};
	if(!obj.upwd){
		res.send({code:402,msg:'请填写正确的密码'});
		return;
	};
	console.log(obj);
	//2.3执行SQL语句
	//是否有用户名和密码同时匹配的数据
	pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],function(err,result){
		if(err)throw err;
		console.log(result);
		//判断是登录成功还是失败
		if(result.length>0){		//有元素，成功
			res.send({code:200,msg:'欢迎回来'});
		}else{		//没有元素，失败
			res.send({code:201,msg:'没有该用户名，请核对后提交'});
		};
	});
});


//3.检索(查找)用户
router.get('/detail',function(req,res){
	//使用query获取get传递的数据
	var obj=req.query;
	//3.2验证输入是否为有效
	if(!obj.uid){
		res.send({code:400,msg:'请输入正确的信息'});
		return;
	};
	console.log(obj);
	//3.3执行SQL语句
	pool.query('select * from xz_user where uid=?',[obj.uid],function(err,result){
		if(err)throw err;
		res.send(result);
	});
});


//4.修改用户数据
router.post('/update',function(req,res){
	//4.1：使用body获取post请求
	var obj=req.body;
	//console.log(obj);
	//4.2:验证数据是否为空(批量)
	//遍历对象，访问每个属性
	var i=400;
	for(var key in obj){
		i++;
		//console.log(key,obj[key]);
		//如果属性值为空，提示属性名是必须的
		if(!obj[key]){
			res.send({code:i,msg:key+' 请认真填写'});
			return;
		};
	};
	//4.3执行SQL语句
	//取出用户编号
	var uid=obj.uid;
	//删除对象中的编号属性
	delete obj.uid;
	console.log(obj);
	//
	pool.query('update xz_user set ? where uid=?',[obj,uid],function(err,result){
		if(err)throw err;
		//console.log(result);

	//判断是否修改成功
	if(result.affectedRows>0){
		res.send({code:200,msg:'修改成功'});
	}else{
		res.send({code:201,msg:'修改失败'});
	};
	});
});


//5.用户列表
router.get('/list',function(req,res){
	//5.1使用requy获取get数据
	var obj=req.query;
	console.log(obj);
	//5.2如果为空设置默认值
	var count=obj.count;
	var pno=obj.pno;
	if(!count){
		count=2;
	};
	if(!pno){
		pno=1;
	};
	console.log(count,pno);

	//5.3将值转为整型
	count=parseInt(count);
	pno=parseInt(pno);

	//5.4计算开始
	var start=(pno-1)*count;
	
	//5.5开始执行SQL语句
	pool.query('select * from xz_user limit ?,?',[start,count],function(err,result){
		if(err)throw err;
		res.send(result);
	});
});


//6.删除列表
router.get('/delete',function(req,res){
	//6.1用query接收get请求
	var obj=req.query;
	//console.log(obj);

	//6.2验证是否为空
	if(!obj.uid){
		res.send({code:401,msg:'请输入需要删除的编号'});
		return;
	};

	//6.3执行SQL语句
	pool.query('delete from xz_user where uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		//console.log(result);
		//判断是否删除成功
	if(result.affectedRows>0){
		res.send({code:200,msg:'操作成功'});
	}else{
		res.send({code:201,msg:'删除失败'});
	};
	});
});


//导出路由器对象 
module.exports=router;