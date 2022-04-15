const request = require("request");
const cheerio = require("cheerio");

function getInfoFromScorecard(url){
    console.log("hey from scorecard gifs function");
    request(url, cb);
}

function cb(err, res, html){
    if(err){
        console.log(err);
    }
    else{
        getMatchDetails(html);
    }
}

function getMatchDetails(html){
    let selecTool = cheerio.load(html);
    console.log("in match details function");

    // we want following details 
    // 1. get venue
    // 2. get Date
    // 3. get result 
    // 4. get teams names
    // 5. get innings

    let desc = selecTool(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let descArr = desc.text().split(',');
    // console.log(descArr); 
    // 1. get venue
    let venueofMatch = descArr[1];
    // 2. get Date
    let dateofMatch = descArr[2];

    console.log("venue: " + venueofMatch);
    console.log("date of match: " + dateofMatch);

}


module.exports = {
    gifs:getInfoFromScorecard,
}