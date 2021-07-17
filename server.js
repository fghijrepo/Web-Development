var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

var entertainmentData = require('./entertainment');
var sightseeingData = require('./sightseeing');


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.get('/home', function(req, res, next) {
	res.render('home');
});

// serve dynamic content (based on .json)
app.get('/entertainment', function(req, res, next) {
	var templateArgs = {
		items: entertainmentData,
		title: "Entertainment"
	};
	res.render('categoryPage', templateArgs);
});


app.get('/sightseeing', function(req, res, next) {
	var templateArgs = {
		items: sightseeingData,
		title: "Sightseeing"
	};
	res.render('categoryPage', templateArgs);
});

app.get('/plan', function(req, res, next) {
        var templateArgs = {
                title: "Plan"
        };
        res.render('categoryPage', templateArgs);
});


app.post('/:category/addItem', function(req, res, next) {
    if (req.params.category === "entertainment") {
        category = entertainmentData;
    } else if (req.params.category === "sightseeing") {
        category = sightseeingData;
    } else {
        res.status(400).send("Post request to the wrong URL");
    }

    if(req.body) {
        var item = {
            name: req.body.name,
            description: req.body.description,
            location: "#",//req.body.location,
            locationName: req.body.locationName,
            photos: req.body.photos
        };

        itemKey = item.name;
        category[itemKey] = item; 
        fs.writeFile(req.params.category + '.json', JSON.stringify(category, null, 2), function(err) {
            if (err) {
                res.status(500).send("Unable to save the new item to \"database\"");
            } else {
                console.log("Server success");
                res.status(200).send();
            }
        });
    } else {
        res.status(400).send("Client error, must send complete item information to server!");
    }
    
});


app.use(express.static('public'));


// safety net for all other url requests
app.get('*', function(req, res) {
	var templateArgs = {
		title: "Life"
	};
	res.status(404).render('404Page',templateArgs);
});

// listen on the intended port
app.listen(port, function() {

	console.log("==Server listening  on port", port);
});

