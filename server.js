const express = require('express');
const bodyParser= require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var db;
const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://root:root@ds151062.mlab.com:51062/quotes_test', function(err, database){
    if (err) return console.log(err)
    db = database
    app.listen(4000, function() {
        console.log('listening on 4000')
    });
});

app.get('/', function(req, res) {
    db.collection('quotes').find().toArray(function (err, result){
        if (err)
            return console.log(err);
        res.render('index.ejs', {quotes: result});
    });
    // res.sendFile(__dirname + '/index.html');
});


app.put('/quotes', function (req, res) {
    // findOneAndUpdate(query, update, options, callback)
    db.collection('quotes')
        .findOneAndUpdate({name: 'Yoda'}, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, function(err, result) {
            if (err) return res.send(err)
            res.send(result)
        });
});


app.delete('/quotes', function(req, res) {
    //findOneAndDelete(query,options,callback)
    db.collection('quotes')
        .findOneAndDelete(
            {name: req.body.name},
            function(err, result) {
                if (err)
                    return res.send(500, err)
                res.send({message: 'A darth vader quote got deleted'})
        });
});

app.post('/quotes', function(req, res) {
    db.collection('quotes').save(req.body, function(err, result){
        if (err)
            return console.log(err);

        console.log('saved to database');
        res.redirect('/');
    });
});


