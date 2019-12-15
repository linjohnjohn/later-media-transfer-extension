import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

export async function getHTML(url) {
    const { data: html } = await axios.get(url);
    return html;
}

export async function getInstagramSharedDataJSON(url) {
    try {
        const html = await getHTML(url);
        const $ = cheerio.load(html);
        const dataInString = $('body script[type="text/javascript"]').html();
        const scriptPrefix = 'window._sharedData = ';
        const sharedDataJSON = JSON.parse(dataInString.replace(scriptPrefix, '').slice(0, -1));
        return sharedDataJSON;
    } catch (error) {
        console.log(error);
    }
}

export function getInstagramSharedDataJSONFromFile(filePath) {
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        const dataInString = $('body script[type="text/javascript"]').html();
        const scriptPrefix = 'window._sharedData = ';
        const sharedDataJSON = JSON.parse(dataInString.replace(scriptPrefix, '').slice(0, -1));
        return sharedDataJSON;
    } catch (error) {
        console.log(error);
    }
}

export async function getInstagramHashTagPosts(hashtag) {
    try {
        const sharedData = await getInstagramSharedDataJSON(`https://instagram.com/explore/tags/${hashtag}`);
        const followers = parseInt(sharedData.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.count);
        return followers;
    } catch (error) {
        console.log(error);
    }
}

export function generateInstagramLinkFromShortcode(shortcode) {
    return `https://www.instagram.com/p/${shortcode}/`;
}

/**
 * Takes and array and returns a dedupped copy of it
 * @param {*} array
 */
export function dedup(array) {
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