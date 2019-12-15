import shell from 'shelljs';

const caliTimer = 24 * 3600 * 1000;

shell.exec('node -r esm trend_content_scraper\\scraper.js calisthenics.txt');

setInterval(() => {
    shell.exec('node -r esm trend_content_scraper\\scraper.js calisthenics.txt');
}, caliTimer);