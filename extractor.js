const { chromium } = require('playwright');

/**
 * Extracts transcript from a Google Drive video/audio file view.
 * @param {string} url - The Google Drive file URL.
 * @returns {Promise<{text: string, fileName: string}>}
 */
async function extractTranscript(url) {
    const browser = await chromium.launch({ headless: true }); // Headless for server
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log(`Navigating to: ${url}`);
        await page.goto(url);

        // Step 1: Push the "Play" button
        const playButtonSelector = 'button[jsname="dW8tsb"]';
        await page.waitForSelector(playButtonSelector, { state: 'visible', timeout: 30000 });
        await page.click(playButtonSelector);

        // Wait a bit for UI to react
        await page.waitForTimeout(2000);

        // Step 2: Push the "Transcript" button
        const transcriptButton = page.locator('span[jsname="V67aGc"]').filter({ hasText: 'Расшифровка' });
        await transcriptButton.waitFor({ state: 'visible', timeout: 10000 });
        await transcriptButton.click();

        // Step 3: Wait then copy text from all segments
        const transcriptDivSelector = 'div.wyBDIb';
        await page.waitForSelector(transcriptDivSelector, { state: 'attached', timeout: 15000 });

        // Add a small wait to ensure all segments are rendered
        await page.waitForTimeout(2000);

        // Extract all text
        const segments = await page.$$eval(transcriptDivSelector, divs => divs.map(div => div.innerText.trim()));
        const mergedTranscript = segments.join(' ');

        // Get and sanitize page title for filename
        const rawTitle = await page.title();
        const sanitizedTitle = rawTitle
            .replace(/ - Google Диск$/, '')
            .replace(/\.mp4$/, '')
            .replace(/[<>:"/\\|?*]/g, '_')
            .trim();
        
        const fileName = `${sanitizedTitle || 'transcript'}.txt`;

        return {
            text: mergedTranscript,
            fileName: fileName
        };

    } finally {
        await browser.close();
    }
}

module.exports = { extractTranscript };
