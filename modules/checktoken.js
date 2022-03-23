var jwt=require("jsonwebtoken");

module.exports=function(req,res,next){

	var token=req.query.token;

	if(token){

		jwt.verify(token,"哼哼哈嘿",(err,decode)=>{

			if(err){
				res.send({
					code:0
				})
			}else{
				req.userId=decode.userId;
				next()
			}

		})

	}else{
		res.json({
			code:0
		})
	}

}