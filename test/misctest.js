require("chromedriver");

const { Builder, By, Key} = require("selenium-webdriver");
const assert = require("assert");

let vtest, vbutton;

async function menuTest() {
//open Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
  //open the website
    await driver.get('http://127.0.0.1:5500/build/index.html');
  //set window size to 1600*900
    await driver.manage().window().setRect({width: 1600, height: 900}); 

  //create loop element
    await driver.findElement(By.id('HeadLoopButton')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[2]/input')).sendKeys('test' + Key.RETURN);

  //create taskbutton element above loop element
    await driver.findElement(By.id('TaskButton')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/input')).sendKeys('test' + Key.RETURN);

  //move taskbutton element into loop element
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div[1]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[3]/div/div[2]/div')).click();

  //check if element was moved by checking if expected text is available 
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[1]/span')).getText();
    assert.strictEqual(vtest, 'test');
    console.log('Move Test passed');

  //click loop delete button and confirm deletion of underlying elements
    vbutton = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[2]/div[2]'));
    await driver.executeScript("arguments[0].click();", vbutton);
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[3]/div[1]')).click();
  //check if both elements have been deleted (array of elements is empty)
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 0);
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 0);
    console.log('Structure Deletion Test passed');

  //click undo button once and check if elements have been restored
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[2]/div/div[1]/div')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 1);
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 1);
  //click undo again (reversing the move) and check if element has been moved
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[2]/div/div[1]/div')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 0);
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/span')).getText();
    assert.strictEqual(vtest, 'test');
    console.log('Undo Test passed');

  //click redo button and check if element has been moved back
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[2]/div/div[2]/div')).click();
    vtest = await driver.findElement(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[1]/span')).getText();
    assert.strictEqual(vtest, 'test');
    console.log('Redo Test passed');

  //click reset button and check if elements have been deleted again
    await driver.findElement(By.xpath('/html/body/main/div[1]/div[2]/div/div[3]')).click();
    await driver.findElement(By.xpath('/html/body/main/div[2]/div[2]/div[3]/div[1]')).click();
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 0);
    vtest = (await driver.findElements(By.xpath('/html/body/main/div[1]/div[4]/div[1]/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[1]/span'))).length;
    assert.strictEqual(vtest, 0);
    console.log('Reset Test passed');

  } finally {
  //close the browser
    await driver.quit();
  }
}

menuTest();