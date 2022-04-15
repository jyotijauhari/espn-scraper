/**
step 1: request html from url using request()
step 2: load html using cheerio -> selectTool = cheerio.load(html) -> cheerio simply parses markup and provides an API for manipulating the resulting data structure
step 3: using selectTool we try to get <a> tag whiich has href of allResults page. we have use selector -> attribute selector here
step 4: After getting <a> we want the href that has relative link for next page using -> anchorOfAllResultsButton.attr("href");
step 5: new url = url + relativelink
step 6: the html of this new link needs to be loaded for getting all match links -> pass this url to new function where we can again use request to load html 

*/

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require("request");
const cheerio = require("cheerio");
const { getAllMatch } = require("./AllMatch");

//request is async
request(url,cb);

// call back function 
function cb(err, response, html){
    if(err){
        console.log(err);
    }
    else{
        handleHtml(html);
    }
}

function handleHtml(html){
    //cheerio stores data in form of object
    // Cheerio parses HTML and it traverses the html so that data can be manipulated according to user's needs
    let selectTool = cheerio.load(html);

    let anchorOfAllResultsButton = selectTool('span[class = "ds-inline-flex ds-items-center ds-leading-none"]>a[class="ds-block ds-text-center ds-uppercase ds-text-ui-typo-primary ds-underline-offset-4 hover:ds-underline hover:ds-decoration-ui-stroke-primary ds-block"]') ;
    // console.log(anchorOfAllResultsButton);

    let relativeLink = anchorOfAllResultsButton.attr("href");
    // console.log(relativeLink);

    let AllresultsPageLink = "https://www.espncricinfo.com" + relativeLink;
    // console.log(AllresultsPageLink);

    getAllMatch(AllresultsPageLink);

}