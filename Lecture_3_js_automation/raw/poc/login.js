//npm install selenium webdriver
require("chromedriver");
let swd = require("selenium-webdriver");
const { resolve } = require("path");
const { rejects } = require("assert");
//build browser
let bldr = new swd.Builder(); 
// ek tab banaya with the help of browser 
let driver = bldr.forBrowser("chrome").build();
//get function mei jo url pass krege vo open ho jaega
let HPopened = driver.get("https://www.hackerrank.com/auth/login");
let gCodeArr,ginputBox,gCodeBox;

// HPopened.then(function(){
//     // console.log("browser opened");
//     //find element
//     let emailPromise = driver.findElement(swd.By.css("#input-1"));
//     emailPromise.then(function(emailElement){
//      let EwillbeEP = emailElement.sendKeys("fscdscscds");
//      EwillbeEP.then(function(){
//          console.log("data entered");
//      })
//     })
// });

HPopened.then(function(){
    let addImpWaitP = driver.manage().setTimeouts({ implicit: 10000 });
    return addImpWaitP;
}).then(function(){
    // console.log("browser opened");
    //find element
    let emailPromise = driver.findElement(swd.By.css("#input-1"))
    let pwdPromise =  driver.findElement(swd.By.css("#input-2"));
    let bothElement = Promise.all([emailPromise,pwdPromise]);
    return bothElement;
}).then(function(bothElement){
     let EwillbeEP = bothElement[0].sendKeys("neerajshukla2531@gmail.com");
     let pwdwillbeEP = bothElement[1].sendKeys("Neeraj@123");
     let bothKeysWillBeEntered = Promise.all([EwillbeEP,pwdwillbeEP]);
     return bothKeysWillBeEntered;
}).then(function(){
    let loginbtnP = navigator(".ui-btn.ui-btn-large.ui-btn-primary.auth-button");
    return loginbtnP;
}).then(function(){
    let IpPromise = navigator("#base-card-1-link");
    return IpPromise;
}).then(function(){
    let arrayP = navigator("a[data-attr1='warmup']");
    return arrayP;
}).then(function(){
    let allQusP = driver.findElements(swd.By.css(".js-track-click.challenge-list-item"));
    return allQusP;
}).then(function(allQs){
    let hrefArray = [];
    for(let i=0;i<allQs.length;i++){
        let hrefp = allQs[i].getAttribute('href');
        hrefArray.push(hrefp);
    }
   
    //sbhi links ko ek sath collect krne k liye function promiseall
    let allhrefPArr = Promise.all(hrefArray);
    return allhrefPArr;
 }).then(function(hrefArr){
    //  console.log(hrefArr);
    let firstQwillBeSubmitP = questionsubmitter(hrefArr[0]);
    for(let i=1;i<hrefArr.length;i++){
        firstQwillBeSubmitP = firstQwillBeSubmitP.then(function(){
            let qsp = questionsubmitter(hrefArr[i]);
            return qsp;
        })
    }
    return firstQwillBeSubmitP;
 }).then(function(){
     console.log("All questions submitted");
 })

HPopened.catch(function(err){
    console.log("error occure");
});

function navigator(selector){
    let pPromise = new Promise(function(resolve,reject){
        let searchElement =  driver.findElement(swd.By.css(selector));
        searchElement.then(function(searchElement){
        let clickbtn = searchElement.click();
        return clickbtn;
        }).then(function(){
           resolve();
        }).then(function(err){
            // console.log(err);
            reject(err);
        })
    });
  return pPromise;
    
}

function questionsubmitter(quslink){
    return new Promise(function(resolve,reject){
        let qusP = driver.get(quslink);
        qusP.then(function(){
        let editorialwillbeclicked =  navigator("a[data-attr2='Editorial']");
        return editorialwillbeclicked;
        }).then(function(){
            //handle lock button
            let lockbtnhandle = lockhandler();
            return lockbtnhandle;
        }).then(function(){
            //code find 
            let codeP = getcode();
            return codeP;
            //copy code
            //paste code
        }).then(function(code){
            // console.log(code);
            let paste = pasteCode(code);
            return paste;
        }).then(function(){
            let submitbtnP = driver.findElement(swd.By.css(".pull-right.btn.btn-primary.hr-monaco-submit"));
            return submitbtnP;
        }).then(function(clickSubmitbtn){
          let submitbtnclicked = clickSubmitbtn.click();
          return submitbtnclicked;
        }).then(function(){
            console.log("submit btn pressed");
            resolve();
        }).catch(function(err){
            reject(err);
        })
    });
}

function lockhandler(){
    return new Promise(function(resolve,reject){
        let lockBtn = driver.findElement(swd.By.css("button.ui-btn.ui-btn-normal.ui-btn-primary .ui-content.align-icon-right"));
        lockBtn.then(function(lockBtn){
            let actions = driver.actions({async : true});
            let elementPressed = actions.move({origin:lockBtn}).click().perform();
            return elementPressed;
        }).then(function(){
            resolve();
        }).catch(function(err){
            // console.log("element is already unlock");
            resolve();
        })
    })
}

function getcode(){
    return new Promise(function (resolve, reject) {
        let h3P = driver.findElements(swd.By.css(".hackdown-content h3"));
        let highlightsP = driver.findElements(swd.By.css(".hackdown-content .highlight"));
        let bArrP = Promise.all([h3P, highlightsP]);
        bArrP
            .then(
                function (bArr) {
                    let h3Arr = bArr[0];
                    let highlightsCodeArr = bArr[1];
                    gCodeArr = highlightsCodeArr;
                    let tPArr = [];

                    for (let i = 0; i < h3Arr.length; i++) {
                        let textP = h3Arr[i].getText();
                        tPArr.push(textP);
                    }
                    let alltEextPArr = Promise.all(tPArr);
                    return alltEextPArr
                }).then(
                    function (allLangArr) {
                        // console.log(allLangArr);
                        let index = allLangArr.indexOf("C++");
                        let codePromise = gCodeArr[index].getText();
                        return codePromise;
                        // filter out -> C++
                    }).then(function (code) {
                        resolve(code);
                    }).catch(function (err) {
                        reject(err);
                    })
    })
}

function pasteCode(code){
    return new Promise(function(resolve,reject){
        let problemtabfindP = navigator('a[data-attr2="Problem"]');
          problemtabfindP.then(function(){
             let checkboxBtn = navigator('.custom-input-checkbox');
            return checkboxBtn;
          }).then(function(){
               let textarea = driver.findElement(swd.By.css('.custominput'));
               return textarea;
           }).then(function(inputTextArea){
               ginputBox = inputTextArea;
                let codewillbesend = inputTextArea.sendKeys(code);
                return codewillbesend;
            }).then(function(){
                let ctrAwillbepressed = ginputBox.sendKeys(swd.Key.CONTROL + "a");
               return ctrAwillbepressed;
           }).then(function(){
               let ctrXwillbepessed = ginputBox.sendKeys(swd.Key.CONTROL + "x");
               return ctrXwillbepessed;
           }).then(function(){
               let codeBoxP = driver.findElement(swd.By.css(".inputarea"));
               return codeBoxP;
           }).then(function(codeBox){
               gCodeBox = codeBox;
               ctrlAp = codeBox.sendKeys(swd.Key.CONTROL + "a");
               return ctrlAp;
           }).then(function(){
               ctrlVp = gCodeBox.sendKeys(swd.Key.CONTROL + "v");
               return ctrlVp;
           })
         .then(function(){
            //    console.log("code copied");
               resolve();
           }).catch(function(err){
               reject(err);
           })
})
}
    
      

