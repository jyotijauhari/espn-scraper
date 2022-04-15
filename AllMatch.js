const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const { log } = require("console");
const {gifs} = require("./scorecard");

function getAllMatch(url){
    // console.log("from allMatch.js ",url);
    request(url, cb);  
}

function cb(err, res, html) {
    if(err){
        console.error("error", err);
    }
    else {
        // console.log("in callback");
        extractAllMatchLink(html);
    }
}

function extractAllMatchLink(html){
    let selecTool = cheerio.load(html);
    // console.log(selecTool);
    let scorecardElemArr = selecTool('div[class = "ds-px-4 ds-py-3"]>a'); //all match links (60 in total)
    
    // all relative links 
    // for(let i=0; i<scorecardElemArr.length; i++){
    //     let htmls = scorecardElemArr[i];
    //     let linkk = selecTool(htmls).attr("href");
    //     // console.log(htmls);
    //     console.log(linkk);
    // }

    // all match scorecard links 
    // all relative links 
    let count = 0;
    for(let i=0; i<scorecardElemArr.length; i++){
        let Scorecard = scorecardElemArr[i];
        let scorecardLink = selecTool(Scorecard).attr("href"); //relative link
        let fullLink = "https://www.espncricinfo.com" + scorecardLink;
        // console.log(fullLink);
        gifs(fullLink);
        // count ++;
        break;
    }
    // console.log(count);
}




module.exports = {
    getAllMatch : getAllMatch
};