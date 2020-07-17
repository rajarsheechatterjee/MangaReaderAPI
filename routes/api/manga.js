const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/manga
// @desc   Gets all chapters for a manga
// @access Public

router.get('/', (req, res) => {
    var rootUrl = 'http://www.mangareader.net/';
	var mangaUrl = req.query.m;
	url = rootUrl + mangaUrl;

	if (mangaUrl) {
        var chapters = [];

	    request(url, function(err, resp, body) {
	        if (err)
	            throw err;

	        $ = cheerio.load(body);

	        $('#listing tr').each(function(result) {
	        	if ($(this).attr('class') != 'table_head') {
		        	var chapterUrl = null;
		        	var chapterFullUrl = null;
		        	var chapterTitle = null;
		        	var chapterDescription = null;
		        	var chapterDate = null;

					$(this).find('td').each(function() {
						chapterDate = $(this).text();
						$(this).find('a').each(function() {
							chapterUrl = $(this).attr('href');
							chapterFullUrl = rootUrl + chapterUrl;
							chapterTitle = $(this).text();
		    			});
	    			});

					var chapter = {
	                    "chapterUrl": chapterUrl,
	                    "chapterFullUrl" : chapterFullUrl,
	                    "chapterTitle": chapterTitle,
	                    "chapterDescription" : chapterDescription,
	                    "chapterDate" : chapterDate
	                };

	                chapters.push(chapter);
				} 
	        });

	        var chapterResults = {
	        	"mangaUrl" : mangaUrl,
	        	"chapterCount" : chapters.length,
	        	"chapters": chapters
	        };

	        res.send(JSON.stringify(chapterResults));
	    });		
	}
});

module.exports = router;