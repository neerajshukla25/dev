let files = ["../f1.txt","../f2.txt","../f3.txt","../f4.txt"];

let fs = require("fs");

console.log("before");

function readFile(i){
if(i==files.length){
    return;
}

fs.readFile(files[i],function(err,content){
    console.log(`content ${content}`);
    readFile(i+1);
})
}

readFile(0);

console.log("after");
