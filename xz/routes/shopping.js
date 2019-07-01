const express=require('express');
const pool=require('../pool.js');
var router=express.Router();
router.post('',function(req,res){
	var obj=req.body;
	if(!lid){
		res.send({code:401,msg:'请输入编号'});
		return;
	};
	if(!sname){
		res.send({code:402,msg:'请输入商品名字'});
		return;
	};
	if(!price){
		res.send({code:403,msg:'请输入商品价格'});
		return;
	};
	if(!brand){
		res.send({code:404,msg:'请输入商品类别'});
		return;
	};
	if(!color){
		res.send({code:405,msg:'请输入商品颜色'});
		return;
	};
	if(!size){
		res.send({code:406,msg:'请输入商品尺寸'});
		return;
	};
	pool.query('insert into xz_shoppingcart_item set ?',[obj],function(err,result){
		if(err) throw err;
		//console.log(result);
	});
		if(result.affectedRows>0){
			res.send({code:200,msg:'添加成功'});
		}else{
			res.send({code:201,msg:'添加失败'});
		};
});

router.get('',function(req,res){
	var obj=req.body;
	if(!obj.lid){
		send({code:201,msg:'请先输入需要查询的商品的编号'});
		return;
	};
	pool.query('select * from xz_shoppingcart_item where lid=?',[obj.lid],function(err,result){
		if(err)throw err;
		send({code:200,msg:'操作成功'});
	});
});
module.express=router;