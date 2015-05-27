var express = require('express');
var router = express.Router();

/*
 * GET twitts for given query.
 */
router.post('/search', function(req, res) {
    var T = req.twit;
    var params = req.body;
    T.get('search/tweets',
        params,
        function(err, data, response) {
            if(err === null){
                res.json(data);
            }
            else{
                res.status(err.statusCode).send(err);
            }
        });
});

module.exports = router;