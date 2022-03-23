var router=require("express").Router();

var db=require("../modules/db.js");

var jwt=require("jsonwebtoken");

var checktoken=require("../modules/checktoken.js");

// 登录
/*
 *请求方式为：get
 *userName
 *password
 *响应内容{code:0,token:null}用户名或密码错误   {code:1,token:"fffsdfe",userName:"veb",userId:}成功返回token
 */
router.get("/login",(req,res)=>{

	var connection=db();

	connection.query("select * from user where name=? and pwd=?",[req.query.userName,req.query.password],(err,data)=>{
		
		if(!data.length){
			res.json({
				code:0,
				token:null
			})
		}else{

			var token=jwt.sign({userName:req.query.userName,userId:data[0].Id},"哼哼哈嘿",{
				expiresIn: 60*60*24*7
			})

			res.json({
				code:1,
				token:token,
				userName:req.query.userName,
				userId:data[0].Id
			})

		}

		connection.end()

	})

})


// 注册
/*
 *请求方式为：get
 *userName
 *password
 *响应内容{code:0}被占用   {code:1}成功
 */
router.get("/register",(req,res)=>{

	var connection=db();

	connection.query("select * from user where name=? and pwd=?",[req.query.userName,req.query.password],(err,data)=>{
		
		if(data.length){
			res.json({
				code:0
			})
		}else{
			connection.query("insert into user (name,pwd) values(?,?)",[req.query.userName,req.query.password],(err,data)=>{
				res.json({
					code:1
				})

				connection.end();
			})
		}

	})

})


// router.get("/checklogin",checktoken,(req,res)=>{
// 	res.send({
// 		code:1
// 	})
// })


// 加入购物车
/*
 *请求方式为：get
 *goodId
 *token
 *响应内容{code:0}token无效   {code:1}添加成功 {code:2} 插入失败
*/

router.get("/add",checktoken,(req,res)=>{
	// console.log("111111111111")
	var connection1=db();
	connection1.query("select * from shopcar where goodId=? and userId=?",[req.query.goodId,req.userId],function(err,d){
		if(d.length){
			var connection=db();
			connection.query("update shopcar set count=? where goodId=? and userId=?",[Number(d[0].count)+1,req.query.goodId,req.userId],(err,data)=>{
				if(err){
					res.json({
						code:2
					})
				}else{
					res.json({
						code:1
					})
				}
			})
			connection.end();
		}else{
			var connection=db();
			connection.query("insert into shopcar (goodId,userId,count) values(?,?,?)",[req.query.goodId,req.userId,1],(err,data)=>{

				if(err){
					console.log(err)
					res.json({
						code:2
					})
				}else{
					res.json({
						code:1
					})
				}
		
				connection.end()
		
			})
		}
		connection1.end();
	})
})

// 加入购物车
/*
 *请求方式为：get
 *goodId
 *token
 *响应内容{code:0}token无效   {code:1}添加成功 {code:2} 插入失败
*/
router.get("/remove",checktoken,(req,res)=>{
	
	var connection1=db();
	connection1.query("select * from shopcar where goodId=? and userId=?",[req.query.goodId,req.userId],function(err,d){
		
			var connection=db();
			connection.query("update shopcar set count=? where goodId=? and userId=?",[Number(d[0].count)-1,req.query.goodId,req.userId],(err,data)=>{
				if(err){
					res.json({
						code:2
					})
				}else{
					res.json({
						code:1
					})
				}
			})
			connection.end();
		
		connection1.end();
	})
})



// 删除购物车商品
/*
 *请求方式为：get
 *goodId
 *token
 *响应内容{code:0}token无效   {code:1}删除成功 {code:2} 删除失败
*/

router.get("/del",checktoken,(req,res)=>{
	
	var connection=db();

	connection.query("delete from shopcar where userId=? and goodId=?",[req.userId,req.query.goodId],(err,data)=>{

		if(err){
			res.json({
				code:2
			})
		}else{
			res.json({
				code:1
			})
		}

		connection.end()

	})

})

// 添加购物车


// 获取商品列表
/*
 * 参数 type_one  缺省则获取所有分类列表
 *使用实例 /goodlist?type_one=男装  获取所有男装列表
 */
router.get("/goodlist",(req,res)=>{

	var connection=db();
	var sql="select Id,title,priceStr,mack,evaluate,imageUrl,type_one,type_two from goods where goodType='normal'";
	if(req.query.type_one){
		sql+=" and type_one=?";
	}
	if(req.query.page){
		sql+=" limit "+(parseInt(req.query.page)-1)*30+",30";
	}
	connection.query(sql,[req.query.type_one],(err,data)=>{


		res.json(data);

		connection.end()

	})

})

// 热门商品
router.get("/hotlist",(req,res)=>{

	var connection=db();
	var sql="select Id,title,priceStr,labels,evaluate,salePoint,imageUrl from goods where goodType='hot'";
	
	if(req.query.page){
		sql+=" limit "+(parseInt(req.query.page)-1)*20+",20";
	}
	connection.query(sql,[req.query.type_one],(err,data)=>{


		res.json(data);

		connection.end()

	})

})


// 进店看看
router.get("/supplierlist",(req,res)=>{

	var connection=db();
	var sql="select Id,title,priceStr,mack,evaluate,salePoint,imageUrl from goods where supplier=? and goodType='normal'";
	
	if(req.query.page){
		sql+=" limit "+(parseInt(req.query.page)-1)*20+",20";
	}
	connection.query(sql,[req.query.supplier],(err,data)=>{


		res.json(data);

		connection.end()

	})

})

// 同类商品
router.get("/samelist",(req,res)=>{

	var connection=db();
	var sql="select Id,title,priceStr,mack,evaluate,salePoint,imageUrl from goods where supplier=?";
	
	sql+=" limit 0,5";
	connection.query(sql,[req.query.supplier],(err,data)=>{


		res.json(data);

		connection.end()

	})

})

// 新品
router.get("/newlist",(req,res)=>{

	var connection=db();
	var sql="select Id,title,priceStr,labels,evaluate,salePoint,imageUrl from goods where goodType='new'";
	
	if(req.query.page){
		sql+=" limit "+(parseInt(req.query.page)-1)*20+",20";
	}
	connection.query(sql,[req.query.type_one],(err,data)=>{


		res.json(data);

		connection.end()

	})

})


// 获取商品详情
/*
 *goodId
 */
router.get("/detail",(req,res)=>{

	var connection=db();

	connection.query("select * from goods where Id=?",[req.query.goodId],(err,data)=>{


		res.json(data);

		connection.end()

	})

})


// 获取購物車列表
router.get("/shoplist",checktoken,(req,res)=>{

	var connection=db();


	connection.query("select * from shopcar where userId=?",[req.userId],(err,data)=>{
		console.log(req.userId,req.query.token)

		var list=[];

		var i=0;
		var connection=db();
		function getList(){

			connection.query("select * from goods where Id=?",[data[i].goodId],(err,d)=>{
				d[0].count=data[i].count

				list.push(d[0]);

				if(i<data.length-1){
					i++;
					getList();
				}else{
					res.json(list);
					connection.end();
				}

			})


		}
		if(data.length){
			getList();
		}else{
			res.json(list);
			connection.end();
		}
		



	})
	connection.end();

})


/*
 *搜索接口
 *url   /search
 *query word
 *示例: /search?word=男装	
 */
router.get("/search",(req,res)=>{

	var connection=db();

	connection.query("select * from goods where title like ? or type_one=? or type_two=?",["%"+req.query.word+"%",req.query.word,req.query.word],(err,data)=>{
		res.json(data);
	})

})

/*
 *获取一级分类
 *url   /getType
 */
router.get("/getTypeOne",(req,res)=>{

	var connection=db();

	connection.query("select type_one from goods",(err,data)=>{
		console.log(err);


		var data2=[];

		for(var i=0;i<data.length;i++){
			var flag=true;

			for(var j=0;j<data2.length;j++){
				if(data[i].type_one==data2[j]){
					flag=false;
					break;
				}
			}

			if(flag){
				data2.push(data[i].type_one);
			}

		}


		res.json(data2);
	})

})

// 获取二级分类
// query {type_one:"咖啡"}
router.get("/getTypeTwo",(req,res)=>{
	var connection=db();
	connection.query("select type_two from goods where type_one=?",[req.query.type_one],(err,data)=>{
		var arr=[];
		data.forEach(item=>{
			arr.push(item.type_two);
		})
		arr=[...new Set(arr)];
		res.json(arr);
		connection.end();
	})
})

// 获取二级商品列表
// query {type_one:"咖啡",type_two:"手磨咖啡"}
router.get("/getTypeTwoList",(req,res)=>{
	var connection=db();
	connection.query("select * from goods where type_one=? and type_two=?",[req.query.type_one,req.query.type_two],(err,data)=>{
		res.json(data);
		connection.end();
	})
})


module.exports=router