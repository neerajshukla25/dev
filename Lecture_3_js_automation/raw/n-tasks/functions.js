function name (fullName , fn){
    let message = fn(fullName);
    console.log("hii "+ message);
}

function firstName (fullName){
 return fullName.split(" ")[0];
}

function lastName (fullName){
    return fullName.split(" ")[1];
}

// name("Neeraj Shukla",firstName);
// name("Neeraj Shukla",lastName);

function outer(){
    console.log("this is outer function");
    function inner(){
        console.log("i am inside inner");
    }
    return inner();
}

let a= outer();
// console.log(a);