import { getInstagramSharedDataJSON } from '../lib/scraper';
import { readFileIntoArray, appendArrayToCSV } from '../lib/fileUtils';
import { shuffle } from '../lib/mathUtils';

const timeStep = 3000;

function main() {
    // name of file with hashtags to scrape
    const rawFilename = process.argv[2];
    const filename = rawFilename.replace('.txt', '');
    const hashtags = readFileIntoArray(`trend_content_scraper/${filename}.txt`);
    const newestLinks = [];

    shuffle(hashtags)
        .map(hashtag => hashtag.trim().replace('#', ''))
        .reduce((pastPromise, hashtag) => {
            return pastPromise.then(() => {
                return getTrendingPostFromHashtag(hashtag)
                    .then((newest) => {
                        newest = newest.map(link => [hashtag, link]);
                        newestLinks.push(...newest);
                    }).then(() => {
                        return new Promise((resolve) => {
                            setTimeout(resolve, timeStep);
                        });
                    });
            });
        }, Promise.resolve())
        .then(() => {
            appendArrayToCSV(newestLinks, `trend_content_scraper/${filename}-trendlinks`);
        });
}

async function getTrendingPostFromHashtag(hashtag) {
    try {
        const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
        const sharedData = await getInstagramSharedDataJSON(url);
        const feedArray = sharedData.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_top_posts.edges;
        const newLinks = generatePostLinks(feedArray);
        return newLinks;
    } catch (error) {
        console.log(error);
    }
}

function generatePostLinks(feed) {
    return feed.map(post => {
        const shortcode = post.node.shortcode;
        return `https://www.instagram.com/p/${shortcode}/`;
    });
}

main();