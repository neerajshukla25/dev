function myfun(param){
    // let rval=param();
console.log(param());
}

// myfun(10);
// myfun("neeru");
// myfun([3,4,5,6]);

myfun(function xyz(){
    let a=10;
    a++;
    console.log("i am function passed to myfun");
    return a;
});