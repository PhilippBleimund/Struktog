require('chromedriver');
require('geckodriver');

const chrome = require('selenium-webdriver/chrome');   /* required if you want */
const firefox = require('selenium-webdriver/firefox'); /* to test in headless mode */
const {Builder, By, Key} = require('selenium-webdriver');
const assert = require('assert');

//base paths needed for every xpath interaction
const baseX = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div';
const baseX_2 = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[2]/div';

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
const blockCallButton = new Button(    'BlockCallButton',     '/div[1]/div[2]/input',                 '/div[1]/div[1]/span',                  '/div[2]/div[2]',               '',                         '',                             ''                          );
const taskButton = new Button(      'TaskButton',       '/div[1]/div[2]/input',                 '/div[1]/div[1]/span',                  '/div[2]/div[2]',               '',                         '',                             ''                          );
const countLoopButton = new Button( 'CountLoopButton',  '/div[1]/div[1]/div[2]/input',          '/div[1]/div[1]/div[1]/span',           '/div[1]/div[2]/div[2]',        '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );
const headLoopButton = new Button(  'HeadLoopButton',   '/div[1]/div[1]/div[2]/input',          '/div[1]/div[1]/div[1]/span',           '/div[1]/div[2]/div[2]',        '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );
const footLoopButton = new Button(  'FootLoopButton',   '/div[2]/div[1]/div[2]/input',          '/div[2]/div[1]/div[1]/span',           '/div[2]/div[2]/div[2]',        '/div[1]/div',              '/div[1]/div/div[2]/div',       '/div[1]/div/div[1]/div'    );
const branchButton = new Button(    'BranchButton',     '/div[1]/div[1]/div[1]/div[2]/input',   '/div[1]/div[1]/div[1]/div[1]/span',    '/div[1]/div[1]/div[2]/div[2]', '/div[2]/div[1]',           '/div[2]/div[1]/div[2]/div',    '/div[2]/div[1]/div/div'    );
const caseButton = new Button(      'CaseButton',       '/div[1]/div[1]/div[2]/input',          '/div[1]/div[1]/div[1]/span',           '/div[1]/div[2]/div[3]',        '/div[2]/div[1]/div[2]',    '/div[2]/div[1]/div[3]/div',    '/div[2]/div[1]/div[2]/div' );
const tryCatchButton = new Button(  'TryCatchButton',   '/div[4]/div[2]/div[2]/input',          '/div[4]/div[2]/div[1]/span',           '/div[1]/div[1]/div[2]',        '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );
const functionButton = new Button(  'FunctionButton',   '/div[1]/div[2]/input',                 '/div[1]/div[2]/span',                  '/div[1]/div[6]/div/div',       '/div[2]/div',              '/div[2]/div/div[2]/div',       '/div[2]/div/div/div'       );

let buttons = [inputButton, outputButton, blockCallButton, taskButton, countLoopButton, headLoopButton, footLoopButton, branchButton, caseButton, tryCatchButton, functionButton];
let vButton, vtest;

//function to check specifically for the parameter of the FunctionButton
async function functionButtonParameter(driver) { //we can use absolute xPath here, because we're only doing this once
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/button')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/span')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/input')).sendKeys('testPar' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/span')).getText();
    assert.strictEqual(vtest, 'testPar');
    console.log('Parameter Text Test passed');

    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/button')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/span'))).length;
    assert.strictEqual(vtest, 0);
    console.log('Parameter Deletion Test passed');
}

//function to check deleting and adding cases via the CaseButton menu
async function caseButtonMenu(driver, loopPath) { 
    //click to open case1 text area, put in "test1" and check if true
    vButton = await driver.findElement(By.xpath(baseX + loopPath + '/div[2]/div[1]/div[1]/div/div[1]/div[1]'));
    await driver.executeScript("arguments[0].click();", vButton);
    await driver.findElement(By.xpath(baseX + loopPath + '/div[2]/div[1]/div[1]/div/div[1]/div[2]/input')).sendKeys('test1' + Key.RETURN);
    vtest = await driver.findElement(By.xpath(baseX + loopPath + '/div[2]/div[1]/div[1]/div/div[1]/div[1]/span')).getText();
    
    assert.strictEqual(vtest, 'test1');
    console.log(' Case1 Text Test passed');
    
    //click delete icon for else case and check if case has been deleted
    vButton = await driver.findElement(By.xpath(baseX + loopPath + '/div[2]/div[3]/div[1]/div/div[2]/div'));
    await driver.executeScript("arguments[0].click();", vButton);
    vtest = (await driver.findElements(By.xpath(baseX + loopPath + '/div[2]/div[3]/div[1]/div/div[1]/div[1]/span'))).length;
    
    assert.strictEqual(vtest, 0);
    console.log(' Else Case Deletion Test passed');
    
    //click settings buttons, add else back and one extra case and check
    vButton = await driver.findElement(By.xpath(baseX + loopPath + '/div[1]/div[2]/div[1]'));
    await driver.executeScript("arguments[0].click();", vButton);
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[2]/div/dl/dd[1]/div[2]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[2]/div/dl/dd[2]/div[2]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[3]/div')).click();
    
    vtest = (await driver.findElements(By.xpath(baseX + loopPath + '/div[2]/div[4]/div[1]/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 1);
    vtest = (await driver.findElements(By.xpath(baseX + loopPath + '/div[2]/div[3]/div[1]/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 1);
    console.log(' Case Add Test passed');

    //delete extra case because it's unneccessary to test
    vButton = await driver.findElement(By.xpath(baseX + loopPath + '/div[2]/div[3]/div[1]/div/div[2]/div'));
    await driver.executeScript("arguments[0].click();", vButton);
}

//main test function iterating over all buttons/elements and calling itself to achieve deeper nesting level
async function uiTest(driver, basePath, clickPath, loopClickPath, loopPath, counter) {    
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id == 'FunctionButton' && counter != 0) return; //if current button is FunctionButton and not root -> skip

        //find the button, click and check for class
        console.log(buttons[i].id + ' ' + 'Depth: ' + counter);
        await driver.findElement(By.id(buttons[i].id)).click();
        vtest = await driver.findElement(By.id(buttons[i].id)).getAttribute('class');

        assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
        console.log(' Click Test passed');
        
        //click to open text area, put in "test" and check if text is "test"
        await driver.findElement(By.xpath(basePath + clickPath)).click(); 
        if (buttons[i].id == 'TryCatchButton') { //extra click necessary for TryCatchButton to open textarea
            vButton = await driver.findElement(By.xpath(baseX + loopPath + '/div[4]/div[2]/div[1]')); 
            await driver.executeScript("arguments[0].click();", vButton);
        }
        await driver.findElement(By.xpath(baseX + loopPath + buttons[i].inputX)).sendKeys('test' + Key.RETURN);
        vtest = await driver.findElement(By.xpath(baseX + loopPath + buttons[i].textX)).getText();

        assert.match(vtest, /test/);
        console.log(' Text Test passed');

        if (buttons[i].id == 'FunctionButton') await functionButtonParameter(driver); //test parameter for FunctionButton
        if (buttons[i].id == 'CaseButton') await caseButtonMenu(driver, loopPath); //test menu for CaseButton

        //recursive function call depending on type of current element and depth of recursion
        if (counter == 0 && buttons[i].loopX != '') { 
            await uiTest(driver, baseX_2, buttons[i].clickX, buttons[i].loopClickX, buttons[i].loopX, counter + 1); //wenn von Tiefe 0 auf 1
            switch (buttons[i].id) {
                case 'BranchButton': //jump to the second column of the element
                    await uiTest(driver, baseX_2, '/div[2]/div[2]', '/div[2]/div[2]/div[2]/div', '/div[2]/div[2]/div/div', counter + 1);
                    break;
                case 'CaseButton': //jump to additional columns of the element, in this case a number of 2
                    await uiTest(driver, baseX_2, '/div[2]/div[2]/div[2]', '/div[2]/div[2]/div[3]/div', '/div[2]/div[2]/div[2]/div', counter + 1);
                    await uiTest(driver, baseX_2, '/div[2]/div[3]/div[2]', '/div[2]/div[3]/div[3]/div', '/div[2]/div[3]/div[2]/div', counter + 1);
                    break;
                case 'TryCatchButton': //jump to the second column of the element
                    await uiTest(driver, baseX_2, '/div[5]/div', '/div[5]/div/div[2]/div', '/div[5]/div/div/div', counter + 1);
                    break;
            }
        } else if (counter < 2 && buttons[i].loopX != '') {
            await uiTest(driver, baseX_2, loopClickPath + buttons[i].clickX, loopClickPath + buttons[i].loopClickX, loopPath + buttons[i].loopX, counter + 1); //wenn tiefer als 1
            switch (buttons[i].id) {
                case 'BranchButton': //jump to the second column of the element
                    await uiTest(driver, baseX_2, loopClickPath + '/div[2]/div[2]', loopClickPath + '/div[2]/div[2]/div[2]/div', loopPath + '/div[2]/div[2]/div/div', counter + 1);
                    break;
                case 'CaseButton': //jump to additional columns of the element, in this case a number of 2
                    await uiTest(driver, baseX_2, loopClickPath + '/div[2]/div[2]/div[2]', loopClickPath + '/div[2]/div[2]/div[3]/div', loopPath + '/div[2]/div[2]/div[2]/div', counter + 1);
                    await uiTest(driver, baseX_2, loopClickPath + '/div[2]/div[3]/div[2]', loopClickPath + '/div[2]/div[3]/div[3]/div', loopPath + '/div[2]/div[3]/div[2]/div', counter + 1);
                    break;
                case 'TryCatchButton': //jump to the second column of the element
                    await uiTest(driver, baseX_2, loopClickPath + '/div[5]/div', loopClickPath + '/div[5]/div/div[2]/div', loopPath + '/div[5]/div/div/div', counter + 1);
                    break;
            }
        } 

        //click delete icon and check if element has been deleted (array of applicable elements is empty)
        vButton = await driver.findElement(By.xpath(baseX + loopPath + buttons[i].deleteX));
        await driver.executeScript("arguments[0].click();", vButton);
        vtest = (await driver.findElements(By.xpath(baseX + loopPath + buttons[i].textX))).length;

        assert.strictEqual(vtest, 0);
        console.log(' Deletion Test passed');
    }
}

//main function to start a browser and call our test function
async function selTest() {
    //console.time('Execution Time'); //start timer to measure test execution time
    let driver = await new Builder().forBrowser('chrome').build();
    //let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build(); //open Chrome browser headless
    //let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless()).build(); //open Firefox browser headless
    //await driver.manage().window().maximize(); //maximize window
    await driver.manage().window().setRect({width: 1600, height: 900}); //set window size to 1600*900
    await driver.get('http://127.0.0.1:5500/build/index.html'); //open the website - you may need to use 'http://localhost:8081/' instead, depending on how you host the website locally

    try {
        await uiTest(driver, baseX, '', '', '', 0);
    } finally {
        //console.timeEnd('Execution Time'); //stop timer to measure test execution time
        await driver.quit(); //close the browser
    }
}

selTest();
