//npm install selenium webdriver
require("chromedriver");
let swd = require("selenium-webdriver");

//build browser
let bldr = new swd.Builder(); 
// ek tab banaya with the help of browser 
let driver = bldr.forBrowser("chrome").build();
//get function mei jo url pass krege vo open ho jaega
let challenges = require("./challenges");

async function fn(){
    try{
        let HPopened = driver.get("https://www.hackerrank.com/auth/login");
        await HPopened;
        let addImpWaitP = driver.manage().setTimeouts({ implicit: 10000 });
        await addImpWaitP;
        let emailPromise = driver.findElement(swd.By.css("#input-1"));
        let pwdPromise =  driver.findElement(swd.By.css("#input-2"));
        let bothElement = Promise.all([emailPromise,pwdPromise]);
        let bArr = await bothElement;
        let EwillbeEP = bArr[0].sendKeys("neerajshukla2531@gmail.com");
         let pwdwillbeEP = bArr[1].sendKeys("Neeraj@123");
         let bothKeysWillBeEntered = Promise.all([EwillbeEP,pwdwillbeEP]);
        await bothKeysWillBeEntered;
        let loginbtnP = navigator(".ui-btn.ui-btn-large.ui-btn-primary.auth-button"); 
        await loginbtnP;
        let dropdown = navigator(".ui-icon-chevron-down.down-icon");
        await dropdown;
        let administrativebtnWillBeClicked = navigator("a[data-analytics='NavBarProfileDropDownAdministration']");
        await administrativebtnWillBeClicked;
        await waitforLoader();

        let manageChallengesArr = await driver.findElements(swd.By.css("ul.nav-tabs li"));
        let McClicked =  manageChallengesArr[1].click();
                await McClicked;

        let create_challengePage_Link =  (await driver).getCurrentUrl();


        // await createchallanges(challenges[1]);
        for(let i=0;i<challenges.length;i++){
            await driver.get(create_challengePage_Link);
            await waitforLoader();
            await createchallanges(challenges[i]);
            // await waitforLoader();
        }

        }catch(err){
        console.log(err);
        // return Promise.reject(err);
    }
    
}

fn();

async function navigator(selector){
         try{
            let searchElement =  driver.findElement(swd.By.css(selector));
            let elem = await searchElement
            let clickbtn = elem.click();
            await clickbtn;
         }catch(err){
            return Promise.reject(err);
         }
       
}

async function waitforLoader(){
    let loader = (await driver).findElement(swd.By.css("#ajax-msg"));
    await driver.wait(swd.until.elementIsNotVisible(loader));
}

async function createchallanges(challenge){ 
    let CreatechallangeP = await driver.findElement(swd.By.css(".btn.btn-green.backbone.pull-right"));
    await CreatechallangeP.click();

    let cSelector = ".CodeMirror textarea"; 
    let parent =".CodeMirror div";
    let selectors = ["#name","#preview",
    `#problem_statement-container ${cSelector}`,
    `#input_format-container ${cSelector}`,
    `#constraints-container ${cSelector}`,
    `#output_format-container ${cSelector}`,
    "#tags_tag"];

    let allElemPArr = selectors.map(function(selector){
      return driver.findElement(swd.By.css(selector));
    })

    let allElements = await Promise.all(allElemPArr);
    await allElements[0].sendKeys(challenge["Challenge Name"]);
    await allElements[1].sendKeys(challenge["Description"]);
      
    await enterData(allElements[2],`#problem_statement-container ${parent}`,challenge["Problem Statement"]);    
    await enterData(allElements[3],`#input_format-container ${parent}`,challenge["Input Format"]);    
    await enterData(allElements[4],`#constraints-container ${parent}`,challenge["Constraints"]);    
    await enterData(allElements[5],`#output_format-container ${parent}`,challenge["Output Format"]);   
     await allElements[6].sendKeys(challenge["Tags"]);
     await allElements[6].sendKeys(swd.Key.ENTER);
      
    await navigator(".save-challenge.btn.btn-green");

}
async function enterData(element, parentSelc, data) {
    let parent = await driver.findElement(swd.By.css(parentSelc))
    await driver.executeScript("arguments[0].style.height=`${10}px`", parent);
    await element.sendKeys(data);
}


