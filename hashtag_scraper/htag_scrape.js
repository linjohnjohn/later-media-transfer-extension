import { getInstagramHashTagPosts, dedup } from '../lib/scraper';
import fs from 'fs';

const main = () => {
    const existingHashTags = fs.readFileSync('hashtag_scraper/existinghtag.csv', 'utf8').split('\n')
        .map(row => {
            return row.split(',')[0].trim();
        });
    let hashtags = fs.readFileSync('hashtag_scraper/hashtags.txt', 'utf8').split('\n').map(htag => htag.trim());
    hashtags = dedup(hashtags);

    hashtags = hashtags.filter((htag) => {
        return existingHashTags.indexOf(htag) < 0;
    });

    console.log(hashtags.length);

    let i = 0;
    for (i = 0; i < hashtags.length; i++) {
        const htag = hashtags[i].trim();
        setTimeout(async() => {
            const realtag = htag.replace('#', '');
            const followers = await getInstagramHashTagPosts(realtag);
            const roundedFollowers = String(Math.round(followers / 1000) * 1000);
            const writtenData = `${htag}, ${roundedFollowers}\n`;
            fs.appendFileSync(`hashtag_scraper/existinghtag.csv`, writtenData, 'utf8');
        }, 5000 * i);
    }
};

main();