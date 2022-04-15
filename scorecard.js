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

    // console.log("venue: " + venueofMatch);
    // console.log("date of match: " + dateofMatch);

    // 3. get result
    let matchResultEle = selecTool(".ds-text-tight-m.ds-font-regular.ds-truncate");
    let matchResult = matchResultEle.text();
    // console.log("match result: " + matchResult);

    // 4. get teams names
    let teamNamesArr = selecTool("a[class = 'ds-text-ui-typo hover:ds-text-ui-typo-primary ds-block']");

    let ownTeam = selecTool(teamNamesArr[0]).text();
    let opponentTeam = selecTool(teamNamesArr[1]).text();

    console.log("team 1: " + ownTeam);
    console.log("team 2: " + opponentTeam);

    //5. get innings
    console.log("Innings: ");
    let allBatsmenTable = selecTool(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table > tbody");
    
    // console.log(allBatsmenTable.html()); //html of table 1, because two table is there
    // console.log(allBatsmenTable.length); // 2

    // for(let i=0; i<allBatsmenTable.length;i++){
    //     let tablehtml = selecTool(allBatsmenTable[i]).html();
    //     console.log(tablehtml);
    // }

    //for every table -> get all rows of that table -> find first td span -> because span has special class that empty row doesn't have 
    for (let i = 0; i < allBatsmenTable.length; i++) {
        let allRows = selecTool(allBatsmenTable[i]).find("tr"); // all rows arr -> data of batsmen + empty rows 
        for (let i = 0; i < allRows.length; i++) {
            let row = selecTool(allRows[i]); // selectool isliye likha qki .find() krna h aage row pe, jo ki direct nhi kr skte , isme tr agya-> jisme bohot saare td hai :) 
            let firstColmnOfRow = row.find("td")[0]; //first td of tr
            let spann = selecTool(firstColmnOfRow).find("span"); //getting span of td
            
            // skip didnot bat row
            if(row.hasClass("!ds-border-b-0")){
                // console.log("did not bat row");
            }

            //row -> td -> span that have this this class only have data (skipping empty row indirectly)
            else if(selecTool(spann).hasClass("ds-inline-flex" && "ds-items-center" && "ds-leading-none")){
                let playerName = selecTool(row.find("td")[0]).text().trim();
                let runs = selecTool(row.find("td")[2]).text();
                let balls = selecTool(row.find("td")[3]).text();
                let numberOf4 = selecTool(row.find("td")[5]).text();
                let numberOf6 = selecTool(row.find("td")[6]).text();
                let sr = selecTool(row.find("td")[7]).text();

                console.log(
                    `${playerName} ->  ${runs} ->  ${balls} -> ${numberOf4} -> ${numberOf6} -> ${sr}`
                  );

            }
             
          }
      
      }

}


module.exports = {
    gifs:getInfoFromScorecard,
}