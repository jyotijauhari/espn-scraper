const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
//first install using -> npm i xlsx
const xlsx = require("xlsx");

function getInfoFromScorecard(url){
    console.log("hey from scorecard gifs function");
    request(url, cb);
}

function cb(err, res, html){
    if(err){
        console.log(err);
    }
    else{
        console.log("---------------------------------------------------------------------------------------");
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
                
                //storing details in excel file
                processInformation(dateofMatch, venueofMatch, matchResult, ownTeam, opponentTeam, playerName, runs, balls, numberOf4, numberOf6, sr);

            }
             
          }
      
      }

}

function processInformation(dateOfMatch, venueOfMatch, matchResult, ownTeam, opponentTeam, playerName, runs, balls, numberOf4, numberOf6, sr){
    let mainIplFolder = path.join(__dirname, "IPL");

    if(!fs.existsSync(mainIplFolder)){
        fs.mkdirSync(mainIplFolder);
    }

    let teamNamePath = path.join(__dirname, "IPL", ownTeam );
    // let teamNamePath = path.join(__dirname, "IPL", ownTeam + " vs " + opponentTeam); 
    if (!fs.existsSync(teamNamePath)) {
        fs.mkdirSync(teamNamePath);
      }

    let playerPath = path.join(teamNamePath, playerName + ".xlsx");
    let content = excelReader(playerPath, playerName);

    //es6 object syntax 
    let playerObj = {
        dateOfMatch,
        venueOfMatch,
        matchResult,
        ownTeam,
        opponentTeam,
        playerName,
        runs,
        balls,
        numberOf4,
        numberOf6,
        sr
      };

    content.push(playerObj);
    //this function writes all the content into excel sheet , and places that excel sheet data into playerPath-> rohitSharma.xlsx
    excelWriter(playerPath, content, playerName);
  
    }


//this function reads the data from excel file
function excelReader(playerPath, sheetName) {
    if (!fs.existsSync(playerPath)) {
      //if playerPath does not exists, this means that we have never placed any data into that file , so return empty object
      return [];
    }
    //if playerPath already has some data in it 
    let workBook = xlsx.readFile(playerPath);
    //A dictionary of the worksheets in the workbook. Use SheetNames to reference these.
    let excelData = workBook.Sheets[sheetName];
    let playerObj = xlsx.utils.sheet_to_json(excelData);
    return playerObj
}

//this function writes the data to excel file
function excelWriter(playerPath, jsObject, sheetName) {
    //Creates a new workbook
    let newWorkBook = xlsx.utils.book_new();
    //json data -> excel format convert
    let newWorkSheet = xlsx.utils.json_to_sheet(jsObject);
    //it appends a worksheet to a workbook, sheetname is name of worksheet tht we want
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
    // Attempts to write or download workbook data to file
    //add workbook to filesystem (playerpath is filepath)
    xlsx.writeFile(newWorkBook, playerPath);
}


module.exports = {
    gifs:getInfoFromScorecard,
}