const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/chapter
// @desc   Test Route
// @access Public

router.get('/', (req, res) => {
    const rootUrl = 'http://www.mangareader.net/';
    const chapterUrl = req.query.c;
    url = rootUrl + chapterUrl;

	if (chapterUrl) {
        let pages = [];

	    request(url, function(err, response, body) {
            
            if (err) throw err;

	        $ = cheerio.load(body);

	        $('#pageMenu option').each(function(result) {
	        	let pageNumber = null;
	        	let pageUrl = null;
	        	let pageFullUrl = null;

	        	pageUrl = $(this).attr('value');
	        	pageFullUrl = rootUrl + pageUrl;
	        	pageNumber = $(this).text();

				let page = {
                    "pageNumber": pageNumber,
                    "pageUrl" : pageUrl,
                    "pageFullUrl" : pageFullUrl
                };

                pages.push(page);
	        });

	        let pageResults = {
	        	"chapterUrl" : chapterUrl,
	        	"pageCount" : pages.length,
	        	"pages": pages
	        };

	        res.send(JSON.stringify(pageResults));
	    });		
	}
});

module.exports = router; 