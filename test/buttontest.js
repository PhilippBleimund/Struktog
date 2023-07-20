require('chromedriver');
require('geckodriver');

const chrome = require('selenium-webdriver/chrome'); 
const firefox = require('selenium-webdriver/firefox');
const {Builder, By, Key, until, Actions, WebDriver} = require('selenium-webdriver');
const assert = require('assert');

const baseX = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div';

class Button {
    constructor(id, inputX, textX, deleteX, clickX, loopClickX, loopX) {
      this.id = id;
      this.inputX = inputX; //relative XPath for text input area
      this.textX = textX; //relative XPath for text area
      this.deleteX = deleteX; //relative XPath for delete button
      this.clickX = clickX; //relative XPath to click to create an element
      this.loopClickX = loopClickX; //add this to XPath when creating new element within an element
      this.loopX = loopX; //add this to XPath to interact with input, text and delete once an element within an element has been created
    }
}
//                                      id                  inputX                                  textX                                   deleteX                         clickX                      loopClickX                      loopX
const inputButton = new Button(     'InputButton',      '/div[1]/div[2]/input',                 '/div[1]/div[1]/span',                  '/div[2]/div[2]',               '',                         '',                             ''                          );
const outputButton = new Button(    'OutputButton',     '/div[1]/div[2]/input',                 '/div[1]/div[1]/span',                  '/div[2]/div[2]',               '',                         '',                             ''                          );
const taskButton = new Button(      'TaskButton',       '/div[1]/div[2]/input',                 '/div[1]/div[1]/span',                  '/div[2]/div[2]',               '',                         '',                             ''                          );
const countLoopButton = new Button( 'CountLoopButton',  '/div[1]/div[1]/div[2]/input',          '/div[1]/div[1]/div[1]/span',           '/div[1]/div[2]/div[2]',        '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );
const headLoopButton = new Button(  'HeadLoopButton',   '/div[1]/div[1]/div[2]/input',          '/div[1]/div[1]/div[1]/span',           '/div[1]/div[2]/div[2]',        '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );
const footLoopButton = new Button(  'FootLoopButton',   '/div[2]/div[1]/div[2]/input',          '/div[2]/div[1]/div[1]/span',           '/div[2]/div[2]/div[2]',        '/div[1]/div',              '/div[1]/div/div[2]/div',       '/div[1]/div/div[1]/div'    );
const branchButton = new Button(    'BranchButton',     '/div[1]/div[1]/div[1]/div[2]/input',   '/div[1]/div[1]/div[1]/div[1]/span',    '/div[1]/div[1]/div[2]/div[2]', '/div[2]/div[1]',           '/div[2]/div[1]/div[2]/div',    '/div[2]/div[1]/div/div'    );
const caseButton = new Button(      'CaseButton',       '/div[1]/div[1]/div[2]/input',          '/div[1]/div[1]/div[1]/span',           '/div[1]/div[2]/div[3]',        '/div[2]/div[1]/div[2]',    '/div[2]/div[1]/div[3]/div',    '/div[2]/div[1]/div[2]/div' );
const tryCatchButton = new Button(  'TryCatchButton',   '/div[4]/div[2]/div[2]/input',          '/div[4]/div[2]/div[1]/span',           '/div[1]/div[1]/div[2]',        '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );
const functionButton = new Button(  'FunctionButton',   '/div[1]/div[2]/input',                 '/div[1]/div[2]/span',                  '/div[1]/div[6]/div/div',       '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );


let buttons = [inputButton, outputButton, taskButton, countLoopButton, headLoopButton, footLoopButton, branchButton, caseButton, tryCatchButton, functionButton];
let delButton, tryCatchText, vtest;

async function uiTest(driver, basePath, clickPath, loopClickPath, loopPath, counter) {    
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id == 'FunctionButton' && counter != 0) return; //if current button is FunctionButton and not root -> skip

        //find the button, click and check for class
        console.log(buttons[i].id + ' ' + 'Counter: ' + counter);
        await driver.findElement(By.id(buttons[i].id)).click();
        vtest = await driver.findElement(By.id(buttons[i].id)).getAttribute('class');

        assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
        console.log(' Click Test passed');
        
        //click to open text area, put in "test" and check if text is "test"
        await driver.findElement(By.xpath(basePath + clickPath)).click(); 
        if (buttons[i].id == 'TryCatchButton') { //extra click necessary for TryCatchButton to open textarea
            tryCatchText = await driver.findElement(By.xpath(baseX + loopPath + '/div[4]/div[2]/div[1]')); 
            await driver.executeScript("arguments[0].click();", tryCatchText);
        }
        await driver.findElement(By.xpath(baseX + loopPath + buttons[i].inputX)).sendKeys('test' + Key.RETURN);
        vtest = await driver.findElement(By.xpath(baseX + loopPath + buttons[i].textX)).getText();

        assert.match(vtest, /test/);
        console.log(' Text Test passed');

        //recursive function call depending on type of current element and depth of recursion
        if (counter == 0 && buttons[i].loopX != '') { 
            await uiTest(driver, '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[2]/div', buttons[i].clickX, buttons[i].loopClickX, buttons[i].loopX, counter + 1); //wenn von Tiefe 0 auf 1
        } else if (counter < 2 && buttons[i].loopX != '') {
            await uiTest(driver, '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[2]/div', loopClickPath + buttons[i].clickX, loopClickPath + buttons[i].loopClickX, loopPath + buttons[i].loopX, counter + 1); //wenn tiefer als 1
        } else {}
            
        //click delete icon and check if element has been deleted (array of applicable elements is empty)
        delButton = await driver.findElement(By.xpath(baseX + loopPath + buttons[i].deleteX));
        await driver.executeScript("arguments[0].click();", delButton);

        vtest = (await driver.findElements(By.xpath(baseX + loopPath + buttons[i].textX))).length;

        assert.strictEqual(vtest, 0);
        console.log(' Deletion Test passed');
    }
}

async function selTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    //let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build(); //open Chrome browser headless
    //let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless()).build(); //open Firefox browser headless
    await driver.manage().window().maximize();
    await driver.get('http://127.0.0.1:5500/build/index.html'); //open the website 
    await driver.manage().setTimeouts({implicit: 200}, {pageLoad: 500}, {script: 500});
    try {
        await uiTest(driver, baseX, '', '', '', 0);
    } finally {
        //close the browser
        await driver.quit();
    }
}

selTest();