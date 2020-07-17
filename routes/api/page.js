const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/page
// @desc   Test Route
// @access Public

router.get('/', (req, res) => {
    var rootUrl = 'http://www.mangareader.net/';
    var pageUrl = req.query.p;
    var url = rootUrl + pageUrl;

	if (pageUrl) {
	    request(url, function(err, resp, body) {
	        if (err)
	            throw err;

	        $ = cheerio.load(body);

			var page = {};

	        $('#imgholder').each(function(result) {
				$(this).find('img').each(function() {
					var imageWidth = null;
					var imageHeight = null;
					var imageSource = null;
					var imageAlt = null;

					imageWidth = $(this).attr('width');
					imageHeight = $(this).attr('height');
					imageSource = $(this).attr('src');
					imageAlt = $(this).attr('alt');

					page = {
	                    "imageWidth": imageWidth,
	                    "imageHeight" : imageHeight,
	                    "imageSource" : imageSource,
	                    "imageAlt" : imageAlt
	                };
    			});
	        });

	        var pageResults = {
	        	"pageUrl" : pageUrl,
	        	"pageImage" : page
	        };

	        res.send(JSON.stringify(pageResults));
	    });		
	}
});

module.exports = router;