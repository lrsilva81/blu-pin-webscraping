const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

var domain = 'https://news.ycombinator.com/';
var collection = [];
var url = 'newest'

const setDateTime = (str) => {
    
    res = str.split(" ");

    time = parseInt(res[0]);
    descTime = res[1];

    now = new Date();

    if ((descTime.search("second") >= 0) && (time > 0)) {
        dateTime = new Date(now - (time * 1000));      
    } else if ((descTime.search("minute") >= 0) && (time > 0)) {
        dateTime = new Date(now - (time * 60 * 1000)); 
    } else if ((descTime.search("hour") >= 0) && (time > 0)) {
        dateTime = new Date(now - (time * 60 * 60 * 1000));      
    } else {
        dateTime = now;
    }

    return dateTime.getUTCFullYear() + "/" +
        ("0" + (dateTime.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + dateTime.getUTCDate()).slice(-2) + " " +
        ("0" + dateTime.getUTCHours()).slice(-2) + ":" +
        ("0" + dateTime.getUTCMinutes()).slice(-2) + ":" +
        ("0" + dateTime.getUTCSeconds()).slice(-2);
}

const scrapeTarget = async (domain, url, collection, minId, minDate) => {

    var newUrl;
    var again = true;

    if (url) {

        await axios.get(domain + url).then((res) => {
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
                
                const ageText = $(element)
                    .next('tr')
                    .find('.age')
                    .children('a')
                    .text();

                const dateTime = setDateTime(ageText);

                if ((id > minId) && (dateTime.split(" ")[0] > minDate)) { 
                    collection.push({ id, title, source, url, dateTime });
                } else {
                    again = false; 
                }
                
            
            });

            newUrl = again ? $('.morelink').attr('href') : "";

        });
        
        return await scrapeTarget(domain, newUrl, collection, minId, minDate);

    }

    return ;

};

scrapeTarget(domain, url, collection, '0', '2020/07/28').then(result => 
        fs.appendFile('data.json', JSON.stringify(collection), (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!')}))
