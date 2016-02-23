var config = require('./config');

var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
    host: config.elasticHost + ':' + config.elasticPort
});

function deleteIndex() {
    return elasticClient.indices.delete({
        index: config.elasticIndexName
    });
}

function initIndex() {
    return elasticClient.indices.create({
        index: config.elasticIndexName
    });
}

function indexExists() {
    return elasticClient.indices.exists({
        index: config.elasticIndexName
    });
}

function initMapping() {
    return elasticClient.indices.putMapping({
        index: config.elasticIndexName,
        type: "document",
        body: {
            properties: {
                source: { type: "string", index: "not_analyzed" },
                destination: { type: "string", index: "not_analyzed" },
                callerid: { type: "string", index: "not_analyzed" },
                phone: { type: "string", index: "not_analyzed" },
                disposition: { type: "string", index: "not_analyzed" },
                uniqueid: { type: "string", index: "not_analyzed" },
                direction: { type: "string", index: "not_analyzed" },
                recordingfile: { type: "string", index: "not_analyzed" },

                starttime: { type: "date" },
                answertime: { type: "date" },
                endtime: { type: "date" },

                duration_total: { type: "integer" },
                duration_talk: { type: "integer" },
                duration_wait: { type: "integer" }

            }
        }
    });
}

indexExists().then(function(exists) {
    if (exists) {
        console.log('Index exist! (will be removed...)');
        return deleteIndex();
    }
}).then(function() {
    initIndex().then(initMapping).then(function() {
        console.log('Index initialization complete!');
    });
});
