let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
let path = require('path');
// const { createInflate, createDeflateRaw } = require("zlib");
// const { createDecipher } = require("crypto");
let count = 0;
let leaderboard = [];

function eachMatchHandler(url){
    //sending request
    count++;
    request(url,dataReceiver);
}

function dataReceiver(err,res,html)
{
    if(err==null&res.statusCode==200)
    {
        //response received
        count--;
        // console.log(html);
        parsefile(html);
        if(count==0){
            console.table(leaderboard);
        }
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
    let WTS= $(".summary span").text();
    // console.log(winningTeam);
    // console.log(winningTeam.split("won"));
    // let fval = winningTeam.split("won").shift();
    // console.log(fval.trim());
    let wTeam = WTS.split("won").shift().trim();
    console.log(wTeam);

    let bothinnings = $(".card.content-block.match-scorecard-table .Collapsible");
    for(let inn=0; inn<bothinnings.length; inn++){
        let teamName = $(bothinnings[inn]).find("h5").text();
        teamName = teamName.split("Innings").shift().trim();

        if(teamName==wTeam){
            let rows = $(bothinnings[inn]).find("table.table.batsman tbody tr");
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
               addtoLeaderboard(pName,teamName,runs);
                // playerHandler(pName,teamName,runs,balls);
            }
            
        }
        }
        

        console.log("..................................");
    }
    
}

function addtoLeaderboard(pName,teamName,runs){
    //search and update
     runs = Number(runs);
    //create a new entry
    for(let i=0;i<leaderboard.length;i++)
    {
      let entry = leaderboard[i];
      if(entry.name==pName&& entry.team==teamName){
          entry.runs +=runs;
          return;
      }
    }
    let newEntry = {};
    newEntry.name =pName;
    newEntry.team = teamName;
    newEntry.runs = runs;
    leaderboard.push(newEntry);
}

module.exports = eachMatchHandler; 


//  function playerHandler(pName,teamName,runs,balls){
// //check directory 
// let dirPath = path.join(__dirname,teamName);
// let isdirPresent = checkwetherdirpresent(dirPath);
// if(isdirPresent==false)
// {
//     //create directory
//     createDir(dirPath); 
// }
// let filePath = path.join(__dirname,teamName,pName +".json");
// let isfilePresent = checkwetherfilepresent(filePath);
// if(isfilePresent == false){
//     //createvfile
//     createFile(filePath);
//     let entries = [];
//     let newObj = {};
//     newObj.Runs = runs;
//     newObj.Balls = balls;
//     entries.push(newObj);
//     let stringObj = JSON.stringify(entries);
//     fs.writeFileSync(filePath,stringObj);
// }
// else{
//     //append data
//     let content = fs.readFileSync(filePath,"utf-8");
//     let entries = JSON.parse(content);
//     let newObj = {};
//     newObj.Runs = runs;
//     newObj.Balls = balls;
//     entries.push(newObj);
//     let stringObj = JSON.stringify(entries);
//     fs.writeFileSync(filePath,stringObj);
// }
// }