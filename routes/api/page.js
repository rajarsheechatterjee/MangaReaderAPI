const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/page
// @desc   Get a Page From a Chapter
// @access Public

router.get('/:mangaName/:chapterNo/:pageNo', (req, res) => {
	const rootUrl = 'http://www.mangareader.net/';
	const mangaName = req.params.mangaName;
	const chapterNo = req.params.chapterNo;
	const pageNo = req.params.pageNo;

	const pageUrl = mangaName + "/" + chapterNo + "/" + pageNo;

	const url = rootUrl + pageUrl;

	if (pageUrl) {
		request(url, (err, response, body) => {
			if (err)
				throw err;

			$ = cheerio.load(body);

			let page = {};

			$('#imgholder').each(function (result) {
				$(this).find('img').each(function () {
					let imageWidth = null;
					let imageHeight = null;
					let imageSource = null;
					let imageAlt = null;

					imageWidth = $(this).attr('width');
					imageHeight = $(this).attr('height');
					imageSource = $(this).attr('src');
					imageAlt = $(this).attr('alt');

					page = {
						"imageWidth": imageWidth,
						"imageHeight": imageHeight,
						"imageSource": imageSource,
						"imageAlt": imageAlt
					};
				});
			});

			pageResults = {
				"pageUrl": pageUrl,
				"pageImage": page
			};

			res.send(JSON.stringify(pageResults));
		});
	} else {
		res.send('Invalid Url')
	}
});

module.exports = router;