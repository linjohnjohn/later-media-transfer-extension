import shell from 'shelljs';

const loopTimeHours = 7 * 24;
const loopTimer = loopTimeHours * 3600 * 1000;
const puppyDelay = 6 * 3600 * 1000;

shell.exec(`node -r esm content_scraper\\content_scraper.js calisthenics.txt ${7 * 24}`);

setInterval(() => {
    shell.exec(`node -r esm content_scraper\\content_scraper.js calisthenics.txt ${7 * 24}`);
}, loopTimer);

setTimeout(() => {
    setInterval(() => {
        shell.exec(`node -r esm content_scraper\\content_scraper.js puppies.txt ${7 * 24}`);
    }, loopTimer);
}, puppyDelay);