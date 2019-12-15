import { getInstagramSharedDataJSONFromFile, generateInstagramLinkFromShortcode } from '../lib/scraper';
import { writeArrayToCSV } from '../lib/fileUtils';

const sourceFile = 'later/savedPage.html';
const saveFile = 'later/laterLinks.csv';

generateLaterLinksInCSV();

function generateLaterLinksInCSV() {
    const sharedData = getInstagramSharedDataJSONFromFile(sourceFile);
    const savedPosts = sharedData.entry_data.ProfilePage[0].graphql.user.edge_saved_media.edges;
    const laterLinks = savedPosts.map(post => {
        const instagramLink = generateInstagramLinkFromShortcode(post.node.shortcode);
        const encodedLink = encodeURIComponent(instagramLink);
        return `https://app.later.com/2QQB6/import?url=${encodedLink}`;
    });
    writeArrayToCSV(laterLinks, saveFile);
}

function chromeGenerateLaterLinks() {
    const csrfToken = window._sharedData.config.csrf_token;
    const tiles = Array.from(document.querySelectorAll('.v1Nh3.kIKUG._bz0w'));
    const links = tiles.map(tile => {
        return tile.querySelector('a').href;
    });
    const laterLinks = links.map(link => {
        const encodedLink = encodeURIComponent(link);
        return `https://app.later.com/2QQB6/import?url=${encodedLink}`;
    });
    allLaterLinks.push(...laterLinks);
}

function dedup(array) {
    const dedupObj = array.reduce((oldObj, item) => {
        if (oldObj[item]) {
            oldObj[item] += 1;
        } else {
            oldObj[item] = 1;
        }
        return oldObj;
    }, {});
    return Object.keys(dedupObj);
}