/**
 * Created by ajia on 2017/6/21.
 */
var http=require("http"),
    url=require("url"),
    fs=require('fs'),
    mime = require("mime");
var sv=http.createServer(function(req,res){
    if(req.url=="/saveData"){
       req.on("data",function(data){
           console.log("接收到的数据："+data);
           fs.appendFile("dataJson.json",data,'utf-8',function(error,data){
           });
       });
       req.on("end",function(){
           console.log("完了")
       });
            res.end();
    }
    if(req.url=="/verifyName"){
        req.on("data",function(data){
            console.log("接收到的数据："+data);
        //  做比较
        });
        req.on("end",function(){
            console.log("完了")
        });
        res.end("success");
    }
    fs.readFile("."+req.url,function(err,data){
        res.writeHead(200, {'content-type': mime.lookup(req.url) + ";charset=utf-8;"});
        res.end(data);
    });
});
sv.listen("666",function(){
    console.log("server is create success,listen on 666 port!")
});
