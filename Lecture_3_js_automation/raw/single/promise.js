//another way to read a async function

let fs = require("fs");
console.log("before");
//you do't need to pass a cb function
let filewillreadpromise = fs.promises.readFile("f1.txt");
//when function give a value
filewillreadpromise.then(function(data){
    console.log(`${data}`);
})
//when an error occure
filewillreadpromise.catch(function(err){
    console.log(err);
});

console.group("after");

