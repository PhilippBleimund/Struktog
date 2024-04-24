require("chromedriver");

const { Builder, By, Key} = require("selenium-webdriver");
const assert = require("assert");

async function browserChrome() {
//open Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
  //open the website
    await driver.get('http://localhost:8081/');

  //find the button, click and check for class
    await driver.findElement(By.id('TaskButton')).click();
    let vtest = await driver.findElement(By.id('TaskButton')).getAttribute('class');

    assert.strictEqual(vtest, 'columnInput insertButton hand boldText');
    console.log("Click Test passed");

  //click to open text area, put in "test" and check if text is "test"
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/input')).sendKeys('test' + Key.RETURN);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/span')).getText();

    assert.strictEqual(vtest, 'test');
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