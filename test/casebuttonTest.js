require("chromedriver");

const { Builder, By, Key} = require("selenium-webdriver");
const assert = require("assert");

async function browserChrome() {
  //open Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    //open the website
    await driver.get('http://127.0.0.1:5500/build/index.html');

    //find the button, click and check for class
    await driver.findElement(By.id('CaseButton')).click();
    let vtest = await driver.findElement(By.id('CaseButton')).getAttribute('class');

    assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
    console.log("Click Test passed");

    //click to open text area, put in "test" and check if text is "test"
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[2]/input')).sendKeys('test' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span')).getText();

    assert.strictEqual(vtest, 'test');
    console.log('Element Text Test passed');

    //click to open case1 text area, put in "test1" and check if true
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[1]/div[1]/div/div[1]/div[1]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[1]/div[1]/div/div[1]/div[2]/input')).sendKeys('test1' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[1]/div[1]/div/div[1]/div[1]/span')).getText();

    assert.strictEqual(vtest, 'test1');
    console.log('Case1 Text Test passed');

    //click delete icon for else case and check if case has been deleted
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[1]/div/div[2]/div')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[1]/div/div[1]/div[1]/span'))).length;

    assert.strictEqual(vtest, 0);
    console.log('Else Case Deletion Test passed');

    //click settings buttons, add else back and one extra case and check
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/div[1]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[2]/div/dl/dd[1]/div[2]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[2]/div/dl/dd[2]/div[2]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[3]/div')).click();

    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[4]/div[1]/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 1);
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[1]/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 1);
    console.log('Case Add Test passed');

    //click delete icon and check if element has been deleted (array of applicable elements is empty)
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/div[3]')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span'))).length;

    assert.strictEqual(vtest, 0);
    console.log('Deletion Test passed');
    

  } finally {
    //close the browser
    await driver.quit();
  }
}

browserChrome();