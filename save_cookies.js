const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('Opening browser to save your authenticated session...');
    console.log('Please log in to Google Drive manually when the browser opens.');
    console.log('Once authenticated, the browser will close and cookies will be saved.\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Google Drive
    await page.goto('https://drive.google.com/');

    // Wait for user to authenticate (5 minutes timeout)
    console.log('Waiting for authentication...');
    await page.waitForURL('**/drive/my-drive**', { timeout: 5 * 60 * 1000 }).catch(() => {
        console.log('Manual navigation detected');
    });

    // Save the session storage state (cookies + local storage)
    const storageState = await context.storageState();
    fs.writeFileSync('cookies.json', JSON.stringify(storageState, null, 2));

    console.log('\n✓ Session saved to cookies.json');
    console.log('Your authenticated session is now ready to use!');

    await browser.close();
})();
