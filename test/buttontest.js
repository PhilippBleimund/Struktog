require("chromedriver");

const { Builder, By, Key, until} = require("selenium-webdriver");
const assert = require("assert");

async function browserChrome() {
  //open Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    //open the website
    await driver.get('http://localhost:8081/');

    let buttons = ['InputButton', 'OutputButton', 'TaskButton', 'CountLoopButton', 'HeadLoopButton', 'FootLoopButton', 'BranchButton', 'TryCatchButton', 'FunctionButton'];

    for (let i = 0; i <= 10; i++) {
        //find the button, click and check for class
        await driver.findElement(By.id(buttons[i])).click();
        let vtest = await driver.findElement(By.id(buttons[i])).getAttribute('class');

        assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
        console.log("Click Test passed");

        let basexpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div';

        switch (buttons[i]) {
            case 'InputButton':
            case 'OutputButton':
            case 'TaskButton':
                // CASE
                break;
            case 'CountLoopButton':
            case 'HeadLoopButton':
            case 'BranchButton':
                // CASE
                break;
            case 'FootLoopButton':
                // CASE
                break;
            case 'BranchButton':
                //CASE
                break;
            case 'TryCatchButton':
                //CASE
                break;
            case 'FunctionButton':
                //CASE
                break;
            

        }      
    }



    //click to open text area, put in "test" and check if text is "test"
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/input')).sendKeys('test' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/span')).getText();

    assert.strictEqual(vtest, 'E: test');
    console.log('Text Test passed');

    //click delete icon and check if element has been deleted (array of applicable elements is empty)
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[2]')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/span'))).length;

    assert.strictEqual(vtest, 0);
    console.log('Deletion Test passed');
    

  } finally {
    //close the browser
    await driver.quit();
  }
}

browserChrome();