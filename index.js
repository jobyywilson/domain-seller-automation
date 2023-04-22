const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--disable-notifications');
const fs = require('fs');
const userName = process.env.USER_NAME;
const password = process.env.PASSWORD;


describe('Facebook Group Post Automation', function(done) {
  const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
  const groupListRaw = fs.readFileSync('groupList.json', 'utf8');
  const groupList = JSON.parse(groupListRaw)['prod'];
  const domainListRaw = fs.readFileSync('domainList.json', 'utf8');
  const domainList = JSON.parse(domainListRaw);
  

  before(async function() {
    // Set up Selenium WebDriver
    


    // Log in to Facebook
    await driver.get('https://www.facebook.com');
    await driver.findElement(By.id('email')).sendKeys(userName);
    await driver.findElement(By.id('pass')).sendKeys(password);
    await driver.findElement(By.xpath('//*[@data-testid="royal_login_button"]')).click();
    await driver.wait(until.titleContains('Facebook'), 5000);

    for(let group of groupList){
      // Click on the create post button
      await driver.get(group);
      for(let domain of domainList){

        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Write something...')]")), 10000);
        await driver.findElement(By.xpath("//*[contains(text(), 'Write something...')]")).click();
        // try{
          await driver.wait(until.elementLocated(By.xpath("//*[@aria-label='Create a public post…']|//*[@aria-label='Write something...']")), 10000);
          await driver.findElement(By.xpath("//*[@aria-label='Create a public post…']|//*[@aria-label='Write something...']")).sendKeys(`${domain} for Sale !`);
  
        // }finally{
        //   await driver.wait(until.elementLocated(By.xpath("//*[@aria-label='Write something...']")), 10000);
        //   await driver.findElement(By.xpath("//*[@aria-label='Write something...']")).sendKeys(`${domain} for Sale !`);

        // }


        await driver.wait(until.elementLocated(By.xpath("//*[@aria-label='Show Background Options']")), 10000);
        await driver.findElement(By.xpath("//*[@aria-label='Show Background Options']")).click()
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath("//*[@aria-pressed='false']")), 10000);
        //style="background-color: rgb(243, 84, 106);"
        //style="background-color: rgb(243, 83, 105);"
        //await driver.wait(until.elementLocated(By.css('[background-color]:first-child')), 10000);
        await driver.sleep(2000)

        //await driver.findElement(By.css('[background-color]:first-child')).click()
        let elements = await driver.findElements(By.xpath("//*[contains(@aria-pressed,'false')]"));

        // Interact with the second element
        let element = elements[domainList.indexOf(domain)+1];
        await element.click();

        //await driver.findElement(By.xpath("//*[@aria-pressed='false']")).click()
        await driver.findElement(By.xpath("//div[@aria-label='Post']")).click();
        await driver.sleep(5000)
      }
      
    }
    
    
    
    console.log('Completed')

  });

  after(async function() {
    // Quit Selenium WebDriver
    //await driver.quit();
  });

  it('should post to Facebook group', async function() {
    // Navigate to Facebook group
    await driver.get('https://www.facebook.com/groups/your_group_id');

    // Create new post
    await driver.findElement(By.css('[aria-label="Create a post"]')).click();
    await driver.findElement(By.css('[contenteditable="true"]')).sendKeys('Your post message');
    await driver.findElement(By.css('[aria-label="Post"]')).click();

    // Check that post was successful
    await driver.wait(until.elementLocated(By.css('.uiScaledImageContainer')), 5000);
  });
});
