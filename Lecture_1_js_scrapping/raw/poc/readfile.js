let fs = require("fs");


//npm install cheerio
//cheerio module require
let cheerio = require("cheerio");
let html = fs.readFileSync('../facts/index.html', "utf-8");
// console.log(html);
let $ = cheerio.load(html);

let h1 = $("h1");
let h1kadata = h1.text();
let p = $("P");
// to get text
let pkadata = p.text();
console.log(pkadata);
//return array of all elements
// let a = $("a");
//print the content of all anchor
// console.log(a.text());
// select am element that is inside an element
let ulkaP = $("ul P");
console.log(ulkaP.text());
// select a class
let classElem = $(".first");
console.log(classElem.text());

