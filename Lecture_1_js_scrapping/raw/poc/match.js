let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
let path = require('path');
const { createInflate, createDeflateRaw } = require("zlib");
const { createDecipher } = require("crypto");

function eachMatchHandler(url){
    request(url,dataReceiver);
}

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

function parsefile(html){
    let $ = cheerio.load(html);
    //extract table
    // let tables = $("table.table.batsman");
    // console.log("data recived");
    // fs.writeFileSync("batsmanTable.html",tables);
    // console.log("data written to disk");

    //extract rows
    

    let bothinnings = $(".match-scorecard-page div .card.content-block.match-scorecard-table");
    for(let inn=0; inn<bothinnings.length; inn++){
        let rows = $(bothinnings[inn]).find("table.table.batsman tbody tr");
        let teamName = $(bothinnings[inn]).find("h5").text();
        teamName = teamName.split("Innings").shift().trim();
        for(let i=0;i<rows.length;i++)
        {
            let colInEveryRow = $(rows[i]).find("td");
            let isPlayer = $(colInEveryRow[0]).hasClass("batsman-cell");
            if(isPlayer==true){
                let pName = $(colInEveryRow[0]).text();
                let runs = $(colInEveryRow[2]).text();
                let balls = $(colInEveryRow[3]).text();
                // let fours = $(colInEveryRow[5]).text();
                // let sixes = $(colInEveryRow[6]).text();
                // let SR = $(colInEveryRow[7]).text();
                // console.log(`${pName} of ${teamName} has scored ${runs} runs and played ${balls} balls`);
                playerHandler(pName,teamName,runs,balls);
            }
            
        }

        console.log("..................................");
    }
    
}

module.exports = eachMatchHandler; 

function checkwetherdirpresent(dirPath){
 return fs.existsSync(dirPath);
}

function checkwetherfilepresent(filePath){
 return fs.existsSync(filePath);
}

function createDir(dirPath){
  return fs.mkdirSync(dirPath);
}

function createFile(filePath){
  return fs.openSync(filePath,"w");
}

function playerHandler(pName,teamName,runs,balls){
//check directory 
let dirPath = path.join(__dirname,teamName);
let isdirPresent = checkwetherdirpresent(dirPath);
if(isdirPresent==false)
{
    //create directory
    createDir(dirPath); 
}
let filePath = path.join(__dirname,teamName,pName +".json");
let isfilePresent = checkwetherfilepresent(filePath);
if(isfilePresent == false){
    //createvfile
    createFile(filePath);
    let entries = [];
    let newObj = {};
    newObj.Runs = runs;
    newObj.Balls = balls;
    entries.push(newObj);
    let stringObj = JSON.stringify(entries);
    fs.writeFileSync(filePath,stringObj);
}
else{
    //append data
    let content = fs.readFileSync(filePath,"utf-8");
    let entries = JSON.parse(content);
    let newObj = {};
    newObj.Runs = runs;
    newObj.Balls = balls;
    entries.push(newObj);
    let stringObj = JSON.stringify(entries);
    fs.writeFileSync(filePath,stringObj);
}
}