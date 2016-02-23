var config = require('./config');
var utils = require('./utils');
var moment = require('moment');

var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
    host: config.elasticHost + ':' + config.elasticPort
});

elasticClient.ping({
    requestTimeout: 30000,
    // undocumented params are appended to the query string
    hello: "elasticsearch"
}, function(error) {
    if (error) {
        console.error('Elasticsearch - is down!');
    } else {
        console.log('Elasticsearch - is ready!');
    }
});

// ASKOZIA
var ami = new require('asterisk-manager')(config.agi_port, config.agi_host, config.agi_login, config.agi_pass, true);
ami.keepConnected();

ami.on('disconnect', function(evt) {
    console.log('ATS askozia disconnected ('+moment().format()+'):');
    console.log(evt);
});

ami.on('connect', function(evt) {
    console.log('==========================================================');
    console.log('ATS askozia connected! '+'('+moment().format()+')');
});

// catch CDR event and send metrics to InfluxDB
ami.on('cdr', function(evt) {

    // console.log("==========================================================");
    // console.log('CDR event! '+'('+moment().format()+')');
    // console.log("==========================================================");
    // console.log(evt);
    // console.log("==========================================================");

    var data = utils.prepareData(evt);
    // console.log(data);
    // console.log("==========================================================");

    elasticClient.index({
        index: config.elasticIndexName,
        type: 'document',
        id: evt.uniqueid,
        body: data
    }, function(error, response) {
        if (error) {
            console.log('Elastic error: ');
            console.log(error);
        }

        // console.log('Elastic response: ');
        // console.log(response);
    });

});

ami.connect(function(){
});
