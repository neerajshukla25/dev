

let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
let path = require('path');
const { createInflate, createDeflateRaw } = require("zlib");
const { createDecipher } = require("crypto");
let url = "https://www.espncricinfo.com/series/8039/scorecard/656495/australia-vs-new-zealand-final-icc-cricket-world-cup-2014-15";
request(url,dataReceiver);


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
                console.log(`${pName} of ${teamName} has scored ${runs} runs and played ${balls} balls`);
                // playerHandler(pName,teamName,runs,balls);
            }
            
        }
        }
        

        console.log("..................................");
    }
    
}
