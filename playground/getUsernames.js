import cheerio from 'cheerio';
import fs from 'fs';
import { writeArrayToCSV } from '../lib/fileUtils';

// html of followers page that you want to 'subscribe' to
const html = fs.readFileSync('playground/html.txt');
const $ = cheerio.load(html);

const usernameRows = [];
$('div.d7ByH a').each((i, el) => {
    usernameRows.push([el.attribs.title]);
});
console.log(usernameRows);

writeArrayToCSV(usernameRows, 'playground/usernames');