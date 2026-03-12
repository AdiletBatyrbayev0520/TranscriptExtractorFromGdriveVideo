const { chromium } = require('playwright');

(async () => {
    // URL from the user request
    const url = 'https://drive.google.com/file/d/16id6SKfOFZG-rbyNNChIOqNGp0V8uz5J/view';

    const browser = await chromium.launch({ headless: false }); // Headless false to see what's happening
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`Navigating to: ${url}`);
    await page.goto(url);

    try {
        // Step 1: Push the "Play" button (as requested by user)
        // From diagnostic: label: "Чтобы начать или возобновить воспроизведение, нажмите K", jsname: "dW8tsb"
        const playButtonSelector = 'button[jsname="dW8tsb"]';
        console.log('Waiting for play button...');
        await page.waitForSelector(playButtonSelector, { state: 'visible', timeout: 30000 });
        console.log('Clicking play button...');
        await page.click(playButtonSelector);

        // Wait a bit for UI to react
        await page.waitForTimeout(2000);

        // Step 2: Push the "Transcript" button
        // Selector: <span jsname="V67aGc" class="mUIrbf-vQzf8d" aria-hidden="true">Расшифровка</span>
        console.log('Waiting for transcript button...');
        const transcriptButton = page.locator('span[jsname="V67aGc"]').filter({ hasText: 'Расшифровка' });

        await transcriptButton.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Clicking transcript button...');
        await transcriptButton.click();

        // Step 3: Wait then copy text from all divs and merge
        // Selector: <div class="wyBDIb" data-timestamp="...">text</div>
        const transcriptDivSelector = 'div.wyBDIb';
        console.log('Waiting for transcript segments to load...');
        await page.waitForSelector(transcriptDivSelector, { state: 'attached', timeout: 15000 });

        // Add a small wait to ensure all segments are rendered
        await page.waitForTimeout(2000);

        // Extract all text
        const segments = await page.$$eval(transcriptDivSelector, divs => divs.map(div => div.innerText.trim()));

        const mergedTranscript = segments.join(' ');

        // Get and sanitize page title for filename
        const rawTitle = await page.title();
        // Remove " - Google Диск" or similar suffixes if present, and sanitize
        const sanitizedTitle = rawTitle
            .replace(/ - Google Диск$/, '')
            .replace(/.mp4$/, '')
            .replace(/[<>:"/\\|?*]/g, '_') // Replace illegal characters with underscores
            .trim();

        const fileName = `${sanitizedTitle || 'transcript'}.txt`;

        console.log('\n--- EXTRACTED TRANSCRIPT (SNIPPET) ---\n');
        console.log(mergedTranscript.substring(0, 500) + '...');
        console.log('\n--------------------------------------\n');

        // Save to file
        const fs = require('fs');
        fs.writeFileSync(fileName, mergedTranscript);
        console.log(`Full transcript saved to: ${fileName} (${segments.length} segments extracted)`);

    } catch (error) {
        console.error('An error occurred during extraction:', error);
        // Take a screenshot on failure for debugging
        await page.screenshot({ path: 'extraction_error.png' });
        console.log('Screenshot saved to extraction_error.png');
    } finally {
        await browser.close();
    }
})();
