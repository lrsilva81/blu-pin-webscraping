const cheerio = require('cheerio');
const fetch = require('node-fetch');

var url = 'https://news.ycombinator.com/';

const scrapeTarget = async (url) => {

    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    return $('.athing').map(function(i,el) {
        // return $(this).html();
        return {
            id: $(this).find('a').attr('id'),
            title: $(this).find('.storylink').text(),
            source: $(this).find('.sitestr').text(),
            url: $(this).find('.storylink').attr('href')
        }
    }).get();
}

scrapeTarget(url).then(result => console.log(result));