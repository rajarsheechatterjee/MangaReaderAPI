const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/chapter
// @desc   Get a Chapter From a Manga
// @access Public

router.get('/:mangaName/:chapterNo', (req, res) => {
	const rootUrl = 'http://www.mangareader.net/';
	const mangaName = req.params.mangaName;
	const chapterNo = req.params.chapterNo;
	const chapterUrl = mangaName + "/" + chapterNo;
	const url = rootUrl + chapterUrl;

	let pages = [];

	if (chapterUrl) {

		request(url, (err, response, body) => {

			if (err) throw err;

			$ = cheerio.load(body);

			$('#pageMenu option').each(function (result) {
				let pageNumber = null;
				let pageUrl = null;
				let pageFullUrl = null;

				pageUrl = $(this).attr('value');
				pageFullUrl = rootUrl + pageUrl;
				pageNumber = $(this).text();

				page = {
					"pageNumber": pageNumber,
					"pageUrl": pageUrl,
					"pageFullUrl": pageFullUrl
				};

				pages.push(page);
			});

			pageResults = {
				"chapterUrl": chapterUrl,
				"pageCount": pages.length,
				"pages": pages
			};

			res.json(pageResults);
		});
	}
});

module.exports = router;