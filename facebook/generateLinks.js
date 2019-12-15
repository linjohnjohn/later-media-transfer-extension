import { readFileIntoArray, writeArrayToCSV } from '../lib/fileUtils';

const searches = readFileIntoArray('facebook/searches.txt');
const links = searches.map(generateSearchLink);
writeArrayToCSV(links, 'facebook/link.csv');

function generateSearchLink(search) {
    return `https://www.facebook.com/search/top/?q=${encodeURI(search)}&epa=SEARCH_BOX`;
}