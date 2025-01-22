// Import required modules and plugins
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth'); // For stealth browsing
const fs = require('fs'); // For file operations
const https = require('https'); // For HTTPS requests

// Use Puppeteer with the stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Declare counters for service workers, DNS errors, and manifest-related checks
let serviceWorkerCount = 0;
let dnsErrorCount = 0;
let manifestCount = 0;

/**
 * Introduce a random delay between actions to mimic human behavior.
 * @param {number} min - Minimum delay in milliseconds.
 * @param {number} max - Maximum delay in milliseconds.
 */
const randomDelay = async (min, max) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Delaying for ${delay} ms`);
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Asynchronously checks for a service worker and manifest.json at the given URL.
 * @param {string} url - The URL to check for a service worker and manifest.json.
 */
const checkForServiceWorkerAndManifest = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // Extend navigation timeout to 60 seconds

    // Introduce a random delay before navigating to the URL
    await randomDelay(5000, 10000); // Random delay between 5 and 10 seconds

    // Navigate to the URL
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('Opened the URL: ' + url);

    // Check response status
    if (response.status() !== 200) {
      fs.appendFileSync('invalid_url.txt', url + '\n', { flag: 'a' });
      console.log('Invalid URL: ' + url);
      await browser.close();
      return;
    }

    // Introduce a random delay before checking for Service Worker
    await randomDelay(2000, 5000); // Random delay between 2 and 5 seconds

    // Check for service worker
    try {
      const swTarget = await browser.waitForTarget(
        (target) => target.type() === 'service_worker',
        { timeout: 30000 } // Extend timeout for service worker check
      );
      console.log('Service Worker found');
      fs.appendFileSync('sw_url.csv', url + ',' + swTarget.url() + '\n');
      serviceWorkerCount++;
    } catch {
      fs.appendFileSync('no_sw_url.txt', url + '\n');
    }

    // Introduce a random delay before checking for manifest.json
    await randomDelay(2000, 5000); // Random delay between 2 and 5 seconds

    // Check for manifest.json
    const manifestUrl = `${url}/manifest.json`;
    console.log('Checking for manifest.json at: ' + manifestUrl);

    await page.goto(manifestUrl, { waitUntil: 'networkidle2', timeout: 60000 }); // Extend timeout for manifest navigation
    const manifestContent = await page.evaluate(() => document.body.innerText);

    if (manifestContent) {
      manifestCount++;
      fs.appendFileSync('manifest_url.txt', url + '\n');
      console.log('Manifest.json found at: ' + manifestUrl);

      // Parse manifest.json and check for 'display' field
      const manifest = JSON.parse(manifestContent);
      const displayField = manifest.display || 'Not found';
      fs.appendFileSync(
        'manifest_details.csv',
        url + ',' + displayField + '\n'
      );
      console.log(`Display field in manifest: ${displayField}`);
    } else {
      fs.appendFileSync('no_manifest.txt', url + '\n');
      console.log('No manifest.json found at: ' + manifestUrl);
    }
  } catch (err) {
    console.error(`Error encountered: ${err.message}`);
    handleErrors(err, url);
  } finally {
    await browser.close();
  }
};

/**
 * Handles different types of errors by logging them to specific files.
 * @param {Error} err - The error object encountered during processing.
 * @param {string} url - The URL being processed when the error occurred.
 */
const handleErrors = (err, url) => {
  if (err.message.includes('net::ERR')) {
    fs.appendFileSync('dns_err.txt', url + '\n');
    dnsErrorCount++;
  } else if (err.message.includes('waiting for target failed')) {
    fs.appendFileSync('no_sw_url.txt', url + '\n');
  } else if (err.message.includes('Navigation timeout')) {
    fs.appendFileSync('navigation_timeout_url.txt', url + '\n');
  } else {
    fs.appendFileSync('Other_error_url.txt', url + ',' + err.message + '\n');
  }
};

/**
 * Main pipeline to crawl URLs for service workers and manifest.json.
 */
const crawlURLs = async () => {
  try {
    let currentIndex = parseInt(fs.readFileSync('index.txt', 'utf-8')) || 0;
    const data = fs.readFileSync('data.txt', 'utf-8');
    const urls = data.split(/\r?\n/);

    for (const line of urls) {
      const [id, rawUrl] = line.split(',');
      const url = 'https://' + rawUrl;

      if (parseInt(id) < currentIndex) continue;

      console.log(`Crawling URL No.${id}: ${url}`);
      await checkForServiceWorkerAndManifest(url);

      // Introduce a delay between processing different URLs
      await randomDelay(10000, 20000); // Random delay between 10 and 20 seconds

      fs.writeFileSync('index.txt', id); // Update the current index
    }
  } catch (err) {
    console.error('Error in the main pipeline: ', err);
  }
};

// Start the crawling process
crawlURLs();
