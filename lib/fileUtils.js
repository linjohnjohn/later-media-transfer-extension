import fs from 'fs';
import { dedup } from './scraper';

export function readFileIntoArray(filename) {
    const data = fs.readFileSync(filename, 'utf8').split('\n').map(htag => htag.trim());
    return data;
}

export function writeArrayToCSV(array, filename) {
    const writtenData = array.map(row => {
        if (Array.isArray(row)) {
            return row.join(', ');
        } else {
            return row;
        }
    }).join('\n');
    filename = filename.replace('.csv', '');
    fs.writeFileSync(`${filename}.csv`, writtenData, 'utf8');
}

export function appendArrayToCSV(array, filename) {
    const writtenData = array.map(row => row.join(', ')).join('\n') + '\n';
    fs.appendFileSync(`${filename}.csv`, writtenData, 'utf8');
}

export function dedupCSV(csvPath) {
    const targets = fs.readFileSync(csvPath, 'utf8').split('\n').filter(row => row.trim().length > 0)
        .map(row => {
            const entries = row.split(',');
            if (entries.length === 1) {
                return entries[0].trim();
            } else {
                return entries[1].trim();
            }
        });
    const dd = dedup(targets);
    const writtenData = dd.join('\n');
    fs.writeFileSync(csvPath, writtenData, 'utf8');
}