import { getInstagramSharedDataJSON } from '../lib/scraper';
import { readFileIntoArray, writeArrayToCSV } from '../lib/fileUtils';
import { average, standardDeviation, shuffle } from '../lib/mathUtils';

const timeStep = 3000;
const HOURS_BACK = parseInt(process.argv[3], 10);
const stdArray = [1, 1.5, 1.75, 2, 2.5, 3];

function main() {
    const rawUsernameFilename = process.argv[2];
    const usernameFilename = rawUsernameFilename.replace('.txt', '');
    const usernames = readFileIntoArray(`content_scraper/${usernameFilename}.txt`);
    const newestLinks = [];
    const popularLinksArray = stdArray.map(() => []);
    shuffle(usernames)
        .map((username) => username.trim())
        .reduce((pastPromise, username) => pastPromise.then(() => {
            return getNewPostsFromUser(username)
                .then(({ newest, popular }) => {
                    newest = newest.map(link => [username, link]);
                    popular = popular.map((pop) => pop.map(link => [username, link]));
                    newestLinks.push(...newest);
                    popular.forEach((pop, i) => popularLinksArray[i].push(...pop));
                }).then(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(resolve, timeStep);
                    });
                }).catch(err => {
                    console.log(err);
                    console.log(username);
                    return new Promise((resolve, reject) => {
                        setTimeout(resolve, timeStep);
                    });
                });
        }), Promise.resolve())
        .then(() => {
            const currentTime = new Date();
            console.log(popularLinksArray.length);
            writeArrayToCSV(newestLinks, `content_scraper/${usernameFilename}-newlinks-${currentTime.toDateString()}`);
            popularLinksArray.forEach((popularLinks, i) => writeArrayToCSV(popularLinks, `content_scraper/${usernameFilename}-popularlinks${stdArray[i] * 100}std-${currentTime.toDateString()}`));
        });

    // for (i = 0; i < usernames.length; i++){
    //   const username = usernames[i].trim();
    //   setTimeout(async function() {
    //     let { newest, popular } = await getNewPostsFromUser(username);
    //     newest = newest.map(link => [username, link]);
    //     popular = popular.map((pop) => pop.map(link => [username, link]));
    //     newestLinks.push(...newest);
    //     popular.forEach((pop, i) => popularLinksArray[i].push(...pop));
    //   }, timeStep * i);
    // }
    // setTimeout(() => {
    //   const currentTime = new Date();
    //   console.log(popularLinksArray.length);
    //   writeArrayToCSV(newestLinks, `content_scraper/${usernameFilename}-newlinks-${currentTime.toDateString()}`);
    //   popularLinksArray.forEach((popularLinks, i) => writeArrayToCSV(popularLinks, `content_scraper/${usernameFilename}-popularlinks${stdArray[i] * 100}std-${currentTime.toDateString()}`));
    // }, timeStep * usernames.length + 1)
}

async function getNewPostsFromUser(user) {
    try {
        const url = `https://www.instagram.com/${user}/`;
        const sharedData = await getInstagramSharedDataJSON(url);
        const feedArray = sharedData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
        const newestFeed = getNewestFeedArray(feedArray);
        const popularFeedArray = stdArray.map((std) => getMostPopular(feedArray, std));
        const newLinks = generatePostLinks(newestFeed);
        const popularLinksArray = popularFeedArray.map((popularFeed) => generatePostLinks(popularFeed));
        return {
            newest: newLinks,
            popular: popularLinksArray
        };
    } catch (error) {
        console.log(user);
    }
}

function getNewestFeedArray(feedArray) {
    const d = new Date();
    d.setHours(d.getHours() - HOURS_BACK);
    const thresholdTimeStamp = d.getTime() / 1000;
    const newestFeed = feedArray.filter((post) => post.node.taken_at_timestamp >= thresholdTimeStamp);
    return newestFeed;
}

function getMostPopular(feedArray, STANDARD_DEVIATIONS) {
    const values = feedArray.map(likesFromPost);

    const std = standardDeviation(values);
    const avg = average(values);

    return feedArray.filter((post) => likesFromPost(post) >= avg + STANDARD_DEVIATIONS * std);
}

function likesFromPost(post) {
    return parseInt(post.node.edge_liked_by.count);
}

function generatePostLinks(feed) {
    return feed.map((post) => {
        const { shortcode } = post.node;
        return `https://www.instagram.com/p/${shortcode}/`;
    });
}

main();