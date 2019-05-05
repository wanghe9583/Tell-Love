//使用express构建web服务器 --11:25
const mysql = require("mysql")
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

//创建连接池
var pool=mysql.createPool({
	host:"127.0.0.1",
	port:"3306",
	user:"root",
	password:"",
	database:"products",
	connectionlimit:20
});
//导出
module.exports=pool;

var app = express();
app.listen(3000);
app.use(express.static("public"))
//启用cors跨域，只允许http://127.0.0.1:5500的请求访问该服务端
app.use(cors({
  "origin":["*"]
})); 
//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
//托管静态资源到public目录下
//app.use(express.static('public'));
/*使用路由器来管理路由*/
app.get("/login",(req,res)=>{
	var obj=req.query;
	if (!obj.phone)
	{
		res.send("用户名不能为空");
			return;
	}
	if (!obj.pwd)
	{
		res.send("密码不能为空");
			return;
	}
	pool.query("SELECT * FROM user WHERE phone=? AND upwd=?",[obj.phone,obj.pwd],(err,result)=>{
		if (err) throw err;
		console.log(result)
		if (result.length>0)
		{
			res.send({code:1,msg:"登陆成功",data:result})
		}else{
			res.send({code:-1,msg:"用户名或密码错误"})
			}
		}
	)
})
//2.注册
app.get("/reg",(req,res)=>{
	var obj = req.query
	pool.query("INSERT INTO user SET ?",[obj],(err,result)=>{
		console.log(result)
		console.log(obj.name)
		if (err) throw err;
		if (result.affectedRows>0)
		{
			res.send({code:1,msg:"注册成功",data:obj.name})
		}
	})
})
app.get("/",(req,res)=>{
  var sql=`select * from cases`;
  pool.query(sql,[],(err,result)=>{
    if(err) console.log(err);
    res.send(result);
  });
})
app.get("/aa",(req,res)=>{
  var sql=`select * from quality`;
  pool.query(sql,[],(err,result)=>{
    if(err) console.log(err);
    res.send(result);
  });
})
app.get("/bb",(req,res)=>{
	aid = req.query.aid
	console.log(aid)
  var sql=`select * from quality WHERE aid = ?`;
  pool.query(sql,[aid],(err,result)=>{
    if(err) console.log(err);
    res.send(result);
  });
})
