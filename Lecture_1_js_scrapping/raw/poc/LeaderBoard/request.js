let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
let eachMatchHandler = require("./getLeaderboard.js");


// let fs = require("fs");
request("https://www.espncricinfo.com/series/_/id/8039/season/2015/icc-cricket-world-cup",dataReceiver);

//get html of homepage
function dataReceiver(err,res,html)
{
    if(err==null&res.statusCode==200)
    {
        // console.log(html);
        parsefile(html);
    }
    else if(res.statusCode==404)
    {
        console.log("page not found");
    }
    else{
        console.log(err);
        console.log(res);
    }
}

//get url of nextpage
function parsefile(html){
let $ = cheerio.load(html);
// let list = $("ul.list-unstyled.mb-0");
// fs.writeFileSync("list.html",list);
let a = $("li.widget-items.cta-link a").attr("href");
// console.log(a);

let fulllink = "https://www.espncricinfo.com"+a;
// console.log(fulllink);
request(fulllink,matchPageHandler)
}

function matchPageHandler(err,res,html)
{
    if(err==null&res.statusCode==200)
    {
        // console.log(html);
        parsematch(html);
    }
    else if(res.statusCode==404)
    {
        console.log("page not found");
    }
    else{
        console.log(err);
        console.log(res);
    }
}


//get link of all matches
function parsematch(html)
{
// fs.writeFileSync("allMatches.html",html);
let $ = cheerio.load(html);
let allcards = $("div.col-md-8.col-16");
// fs.writeFileSync("allcarddata.html",carddata);
// console.log(carddata.length);
for(let i=0;i<allcards.length;i++)
{
//   let details = $(allcards[i]).find("p.small.mb-0.match-description").text();
//   let result = $(allcards[i]).find(".extra-small.mb-0.match-description.match-description-bottom").text();
  let allanchor = $(allcards[i]).find(".match-cta-container a");
  let scorecardlink = $(allanchor[0]).attr("href");
//   console.log("###################");
//   console.log(details);
//   console.log(result);
// console.log("https://www.espncricinfo.com"+scorecardlink);
eachMatchHandler("https://www.espncricinfo.com"+scorecardlink);
// console.log("###################");
}


// console.log(a.text());

}