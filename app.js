var express=require("express");
var app=express();
// 设置回调函数名字
app.set('jsonp callback name', 'cb');

var cors=require("cors");

// 延迟两秒响应请求 模拟网络差
// app.use(function(req,res,next){
//     setTimeout(() => {
//         next();
//     }, 2000);
// })


// 引入接口模块
var api=require("./api/api.js")

app.use(cors());


app.use(function(req,res,next){

	setTimeout(function(){

		next();

	},1000)

})




// 静态资源处理
app.use(express.static("public"));

app.get('/a',function(req,res){
    console.log("a")
    res.send("a")
})

app.use("/api",api);
var fs=require("fs");
app.use((req,res,next)=>{
    fs.readFile("./public/index.html",(err,data)=>{
        res.end(data);
    })
})

app.listen(1024)

console.log("1024端口已开启")


