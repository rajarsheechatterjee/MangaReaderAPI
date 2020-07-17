const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

// @route  GET api/search
// @desc   Search a Manga
// @access Public

router.get('/', async (req, res) => {
    const rootUrl = 'http://www.mangareader.net';
    const itemsPerPage = 20;
    const searchTerm = req.query.m;

    if (searchTerm) {
        const url = rootUrl + '/search/?w=' + searchTerm;

        let results = [];

        request(url, (err, response, body) => {
            
            if (err) throw err;

            $ = cheerio.load(body);

            $('#mangaresults .mangaresultitem .mangaresultinner').each(function(result) {
                let resultName = null;
                let resultUrl = null;
                let resultFullUrl = null;
                let thumb = null;
                let chapters = null;
                let type = null;
                let genre = null;

                $(this).find('a').each(function() {
                    resultName = $(this).text();
                    resultUrl = $(this).attr('href');
                    resultFullUrl = rootUrl + resultUrl;
                });

                $(this).find('.imgsearchresults').each(function() {
                    thumb = $(this).css('background-image');
                    thumb = thumb.replace('url(\'','').replace('\')','');
                });

                $(this).find('.chapter_count').each(function() {
                    chapters = $(this).text();
                });

                $(this).find('.manga_type').each(function() {
                    type = $(this).text();
                });

                $(this).find('.manga_genre').each(function() {
                    genre = $(this).text();
                });

                result = {
                    "resultName": resultName,
                    "resultUrl": resultUrl,
                    "resultFullUrl" : resultFullUrl,
                    "resultThumbImageUrl" : thumb,
                    "resultChapters" : chapters,
                    "resultType" : type,
                    "resultGenre" : genre
                };

                results.push(result);
            });

            let pages = 0;

            $('#sp').each(function(result) {
                $(this).find('a').each(function() {
                    let pageUrl = $(this).attr('href');

                    if (pageUrl) {
                        console.log(pageUrl);
                    }
                    pages = pageUrl;
                });
            });

            if (results.length < itemsPerPage) {
                pages = (results.length == 0 ? 0 : 1);
            } else {
                pages = (pages / itemsPerPage) + 1;
            }

            searchResults = {
                "searchTerm" : searchTerm,
                "resultCount" : results.length,
                "resultPageCount" : pages,
                "results": results
            };

            res.send(JSON.stringify(searchResults));
        });		
    }
});

module.exports = router;