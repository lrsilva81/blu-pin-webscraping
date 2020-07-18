const cheerio = require('cheerio');
const axios = require('axios');

var url = 'https://news.ycombinator.com/';

axios.get(url).then((res) => {
    const items = [];
    const $ = cheerio.load(res.data);

    $('.athing').each( (index, element) => {
        const id = $(element)
            .find('a')
            .attr('id')
            .match(/(\d+)/)[0];
        
        const title = $(element)
            .find('.storylink')
            .text();

        const source = $(element)
            .find('.sitestr')
            .text();

        const url = $(element)
            .find('.storylink')
            .attr('href');

        const scoreText = $(element)
            .next('tr')
            .find('.score')
            .text();

        const ageText = $(element)
            .next('tr')
            .find('.age')
            .children('a')
            .text();
        
        items.push({ id, title, source, url, scoreText, ageText });
    
    });

    console.log(items);
});