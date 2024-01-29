// Import required modules and plugins
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth'); // For stealth browsing
const fs = require('fs'); // For file operations
const { parse } = require('csv-parse'); // For CSV parsing
const lineByLine = require('n-readlines'); // For reading files line by line
const https = require('https'); // For HTTPS requests

// Use Puppeteer with the stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Declare counters for service workers and DNS errors
let serviceWorkerCount = 0;
let dnsErrorCount = 0;

/**
 * Asynchronously checks for a service worker at the given URL.
 * @param {string} url - The URL to check for a service worker.
 */
const checkForServiceWorker = async (url) => {
  // Launch a headless browser with specific arguments for optimal performance
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
    const page = await browser.newPage(); // Open a new page in the browser
    await page.setDefaultNavigationTimeout(30000); // Set the navigation timeout

    // Navigate to the URL
    const response = await page.goto(url);
    console.log('Opened the URL: ' + url);

    // Check the response status
    if (response.status() !== 200) {
      fs.writeFileSync('invalid_url.txt', url + '\n', { flag: 'a' });
      console.log('Finished processing ' + url);
      await browser.close();
      return;
    }

    // Wait for the service worker target
    const swTarget = await browser.waitForTarget(
      (target) => target.type() === 'service_worker',
      { timeout: 10000 }
    );

    console.log('Service Worker found');
    fs.appendFileSync('sw_url.csv', url + ',' + swTarget.url() + '\n');
    console.log('Finished processing ' + url);
  } catch (err) {
    console.error(`Error encountered: ${err.message}`);
    handleErrors(err, url); // Handle specific errors
  } finally {
    await browser.close(); // Ensure the browser is closed in case of error or success
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
 * Main pipeline to crawl URLs for service workers.
 */
const crawlURLs = async () => {
  try {
    let currentIndex = parseInt(fs.readFileSync('index.txt', 'utf-8')); // Read and parse the current index
    const data = fs.readFileSync('data.txt', 'utf-8'); // Read the data file
    const urls = data.split(/\r?\n/); // Split the data into lines (URLs)

    for (const line of urls) {
      const [id, rawUrl] = line.split(',');
      const url = 'https://' + rawUrl;

      if (parseInt(id) < currentIndex) continue; // Skip already processed URLs

      console.log(`Crawling URL No.${id}: ${url}`);
      await checkForServiceWorker(url); // Check for a service worker at the URL

      fs.writeFileSync('index.txt', id); // Update the current index after each URL is processed
    }
  } catch (err) {
    console.error('Error in the main pipeline: ', err);
  }
};

// Start the crawling process
crawlURLs();
