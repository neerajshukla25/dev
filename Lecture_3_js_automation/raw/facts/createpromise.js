let fs = require("fs");
function createPromise(path){
    let pPromise = new Promise(function(resolve,reject){
        fs.readFile(path,function(err,data){
            if(err){
                reject();
            }
            else{
                resolve(data);
            }
        });
    });
    return pPromise;
}
let fPromise = createPromise("f1.txt");

console.log(fPromise);

fPromise.then(function(data){
    console.log("data has arrived");
    console.log(data);
});

fPromise.catch(function(err){
    console.log("inside catch");
    console.log("error");
});


//

