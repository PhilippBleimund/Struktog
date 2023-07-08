require("chromedriver");

const { Builder, By, Key, until} = require("selenium-webdriver");
const assert = require("assert");

async function buttonCheck() {
  //open Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    //open the website
    await driver.get('http://127.0.0.1:5500/build/index.html');

    let buttons = ['InputButton', 'OutputButton', 'TaskButton', 'CountLoopButton', 'HeadLoopButton'/*, 'FootLoopButton'*/, 'BranchButton', 'CaseButton', 'TryCatchButton', 'FunctionButton'];

    for (let i = 0; i < 10; i++) {
        //find the button, click and check for class
        console.log(buttons[i]);
        await driver.findElement(By.id(buttons[i])).click();
        let vtest = await driver.findElement(By.id(buttons[i])).getAttribute('class');

        assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
        console.log('Click Test passed');

        //click to open text area, necessary to do before switch-cases because of extra click needed for TryCatchButton
        await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div')).click(); 

        let textXpath, inputXpath, deleteXpath;

        switch (buttons[i]) {
            case 'InputButton':
            case 'OutputButton':
            case 'TaskButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[2]';
                break;
            case 'CountLoopButton':
            case 'HeadLoopButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/div[2]';
                break;
            case 'FootLoopButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[1]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[1]/div[1]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[2]/div[2]';
                break;
            case 'BranchButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/div[1]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[2]/div[2]';
                break;
            case 'CaseButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/div[3]';
                break;
            case 'TryCatchButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[4]/div[2]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[4]/div[2]/div[1]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[2]';
                await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[4]/div[2]/div[1]')).click(); //extra click to open text area needed
                break;
            case 'FunctionButton':
                inputXpath  = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/input';
                textXpath   = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/span';
                deleteXpath = '/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[6]/div/div';
                break;
        }     
        
        //put in "test" and check if text is "test"
        await driver.findElement(By.xpath(inputXpath)).sendKeys('test' + Key.RETURN);
        vtest = await driver.findElement(By.xpath(textXpath)).getText();

        assert.match(vtest, /test/);
        console.log('Text Test passed');

        //click delete icon and check if element has been deleted (array of applicable elements is empty)
        await driver.findElement(By.xpath(deleteXpath)).click();
        vtest = (await driver.findElements(By.xpath(textXpath))).length;

        assert.strictEqual(vtest, 0);
        console.log('Deletion Test passed');
    }
  } finally {
    //close the browser
    await driver.quit();
  }
}

buttonCheck();