
let pp = require("puppeteer");
async function fn() {
    // headless browser
    let browser = await pp.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        // slowMo:100
    });

    // let tab = await browser.newPage();
    let AllTabs = await browser.pages();
    let tab = AllTabs[0];
    await tab.goto('https://www.hackerrank.com/auth/login');
    await tab.type("#input-1","neerajshukla2531@gmail.com");
    await tab.type("#input-2","Neeraj@123");

    //click login buton
    // await tab.click('.ui-btn.ui-btn-large.ui-btn-primary.auth-button');
     await Promise.all([
      tab.waitForNavigation({waitUntil:'networkidle0'}),
      tab.click('.ui-btn.ui-btn-large.ui-btn-primary.auth-button')
    ]);

   //click on dropdown
  await tab.click('a[data-analytics="NavBarProfileDropDown"]');

  //click on administrative 
  await Promise.all([
            tab.waitForNavigation({  waitUntil: 'networkidle0'}),
            tab.click("a[data-analytics='NavBarProfileDropDownAdministration']")]);

  let manageChallengesArr = await tab.$$("ul.nav-tabs li");
  await manageChallengesArr[1].click();

  let create_challengePage_Link =  await tab.url();
  console.log(create_challengePage_Link);

  //handle single page
  await handlesinglePage(tab,browser);
  }

  async function handlesinglePage(tab,browser){
    await tab.waitForSelector(".backbone.block-center",{visible : true});
     
     let qList = await tab.$$(".backbone.block-center");
     let linkPromiseArr = [];
     for(let i=0;i<qList.length;i++){
            let Link =  tab.evaluate(function(elem){
            return elem.getAttribute("href");
            },qList[i]);
         linkPromiseArr.push(Link);
     }

     let allQlinkArr = await Promise.all(linkPromiseArr);
       let qusnoPArr =[];
     for(let i=0;i<allQlinkArr.length;i++){
         let cLink = `https://www.hackerrank.com${allQlinkArr[i]}`;
         let newTab = await browser.newPage();

         let qusWillBeSolved = questionSolver(cLink,newTab);
         qusnoPArr.push(qusWillBeSolved);
     }
     await Promise.all(qusnoPArr);
     
    //  console.log(Link);

    let allLis = await tab.$$(".pagination ul li");
    let nxtBtn = allLis[allLis.length-2];
    let isDisabled = await tab.evaluate(function(elem){
        return elem.getAttribute("class");
    },nxtBtn);
    if(isDisabled=="disabled"){
        return;
    }
    else{
        await Promise.all([nxtBtn.click(), tab.waitForNavigation({waitUntil:"networkidle0"})]);
        await handlesinglePage(tab,browser);
    }

  }

  async function questionSolver(cLink,newTab){

      await Promise.all([
        newTab.goto(cLink),
        newTab.waitForNavigation({waitUntil:'networkidle0'})
      ]);

      await newTab.waitForSelector("li[data-tab='moderators']",{visible:true});
      await Promise.all([
        newTab.click("li[data-tab='moderators']"),
        newTab.waitForNavigation({waitUntil:'networkidle0'})
      ]);
          
      
    await newTab.waitForSelector(".wide.ui-autocomplete-input",{visible:true});
    await  newTab.type(".wide.ui-autocomplete-input","simran");

       
     await newTab.keyboard.press("Enter");

      await newTab.click(".save-challenge.btn.btn-green");
      await newTab.close();
    }
  fn();

