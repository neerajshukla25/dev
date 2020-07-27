let fs = require("fs");
fs.readFile("f1.txt",function(err,data){
    console.log("content :" + data);
})