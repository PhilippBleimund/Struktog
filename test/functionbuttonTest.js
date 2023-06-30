require("chromedriver");

const { Builder, By, Key, until} = require("selenium-webdriver");
const assert = require("assert");

async function browserChrome() {
  //open Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    //open the website
    await driver.get('http://localhost:8081/');

    //find the button, click and check for class
    await driver.findElement(By.id('FunctionButton')).click();
    let vtest = await driver.findElement(By.id('FunctionButton')).getAttribute('class');

    assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
    console.log("Click Test passed");

    //click to open text area, put in "test" and check if text is "test"
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/input')).sendKeys('test' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/span')).getText();

    assert.strictEqual(vtest, 'test');
    console.log('Function Text Test passed');

    //click on add parameter button, name the parameter "testPar" and check if true
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/button')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/span')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/input')).sendKeys('testPar' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/span')).getText();

    assert.strictEqual(vtest, 'testPar');
    console.log('Parameter Text Test passed');
    
    //delete parameter
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/button')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[3]/div/span'))).length;

    assert.strictEqual(vtest, 0);
    console.log('Parameter Deletion Test passed');

    //click delete icon and check if element has been deleted (array of applicable elements is empty)
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[6]/div/div')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/span'))).length;

    assert.strictEqual(vtest, 0);
    console.log('Function Deletion Test passed');
    

  } finally {
    //close the browser
    await driver.quit();
  }
}

browserChrome();