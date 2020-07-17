const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/manga
// @desc   Gets all Chapters of a Manga
// @access Public

router.get('/:mangaName', (req, res) => {
	const rootUrl = 'http://www.mangareader.net/';
	const mangaName = req.params.mangaName;
	const url = rootUrl + mangaName;

	if(mangaName) {
		
		let chapters = [];

		request(url, (err, response, body) => {
			if (err)
				throw err;

			$ = cheerio.load(body);

			$('#listing tr').each(function (result) {
				if ($(this).attr('class') != 'table_head') {
					let chapterUrl = null;
					let chapterFullUrl = null;
					let chapterTitle = null;
					let chapterDescription = null;
					let chapterDate = null;

					$(this).find('td').each(function () {
						chapterDate = $(this).text();
						$(this).find('a').each(function () {
							chapterUrl = $(this).attr('href');
							chapterFullUrl = rootUrl + chapterUrl;
							chapterTitle = $(this).text();
						});
					});

					chapter = {
						"chapterUrl": chapterUrl,
						"chapterFullUrl": chapterFullUrl,
						"chapterTitle": chapterTitle,
						"chapterDescription": chapterDescription,
						"chapterDate": chapterDate
					};

					chapters.push(chapter);
				}
			});

			chapterResults = {
				"mangaName": mangaName,
				"chapterCount": chapters.length,
				"chapters": chapters
			};

			res.send(JSON.stringify(chapterResults));
		});
	}
});

module.exports = router;