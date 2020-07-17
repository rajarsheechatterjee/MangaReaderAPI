const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/manga
// @desc   Gets all Chapters of a Manga
// @access Public

router.get('/', (req, res) => {
    const rootUrl = 'http://www.mangareader.net/';
	const mangaUrl = req.query.m;
	const url = rootUrl + mangaUrl;

	if (mangaUrl) {
        let chapters = [];

	    request(url, (err, response, body) => {
	        if (err)
	            throw err;

	        $ = cheerio.load(body);

	        $('#listing tr').each(function(result) {
	        	if ($(this).attr('class') != 'table_head') {
		        	let chapterUrl = null;
		        	let chapterFullUrl = null;
		        	let chapterTitle = null;
		        	let chapterDescription = null;
		        	let chapterDate = null;

					$(this).find('td').each(function() {
						chapterDate = $(this).text();
						$(this).find('a').each(function() {
							chapterUrl = $(this).attr('href');
							chapterFullUrl = rootUrl + chapterUrl;
							chapterTitle = $(this).text();
		    			});
	    			});

					chapter = {
	                    "chapterUrl": chapterUrl,
	                    "chapterFullUrl" : chapterFullUrl,
	                    "chapterTitle": chapterTitle,
	                    "chapterDescription" : chapterDescription,
	                    "chapterDate" : chapterDate
	                };

	                chapters.push(chapter);
				} 
	        });

	        chapterResults = {
	        	"mangaUrl" : mangaUrl,
	        	"chapterCount" : chapters.length,
	        	"chapters": chapters
	        };

	        res.send(JSON.stringify(chapterResults));
	    });		
	}
});

module.exports = router;