/**
 * @fileOverview Query
 * @name Query.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Query', [
    'jquery',
    'TYPO3/CMS/Annotate/Observe',
    'TYPO3/CMS/Annotate/async'
], function (
    $,
    Observe,
    async
) {
    /**
     * Query Constructor
     */
    var Query = function(){
        // @type {String}
        this.raw = "";
        // @type {String}
        this.transformed = this.queryize(this.raw);
        // @type {String}
        this.state = this.states.READY;
        // @type {Observe}
        this.observe =  new Observe();
        // @type {String}
        this.queryId = "";
        // @type {Object[]}
        this.results = [];
        // @type {number}
        this.documentCurrentCount =  0;
    };
    Query.prototype = {
        // @type {Object}
        constructor: Query,
        states: {
            ERROR: - 1,
            READY: 1,
            RUNNING: 2,
            FINISHED: 3
        },
        url: function(verb) {
            return this.baseURL + verb;
        },
        /**
         * Transform an input string into a mimir query
         * @param {String} raw input
         * @returns {String} transformed query
         */
        queryize: function(raw) {
            var re = /\|(.*)\|/,
                template = "\
sparql=\"\
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n\
PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
PREFIX dbo:<http://dbpedia.org/ontology/>\n\
PREFIX dbr:<http://dbpedia.org/resource/>\n\
select distinct ?inst where {\n\
$1\n\
}\"";
            raw = raw.replace(re, template);
            return raw;
        },
        /**
         * Update local input
         * @param {String} raw input
         */
        update: function(raw) {
            this.raw = raw;
            this.transformed = this.queryize(this.raw);
            this.observe.trigger();
        },
        /**
         * Run active query
         */
        run: function() {
            var self = this;
            this.state = this.states.RUNNING;
            this.sendQuery(
                "postQuery",
                {queryString: this.transformed},
                function (err, response) {
                    if (err)
                    {
                        TYPO3.Flashmessage.display(3, "ERROR", response);
                        self.state = this.states.ERROR;
                        return;
                    }
                    self.queryId = response.queryId;
                    self.delayForResults();
                    self.observe.trigger();
                }
            );
            self.observe.trigger();
        },
        /**
         * Are we ready to run a query at the moment?
         * @returns {boolean}
         */
        isReady: function() {
            return this.state == this.states.READY;
        },
        /**
         * Are we running the query at the moment?
         * @returns {boolean}
         */
        isRunning: function() {
            return this.state == this.states.RUNNING;
        },
        /**
         * Are we running the query at the moment?
         * @returns {boolean}
         */
        isFinished: function() {
            return this.state == this.states.FINISHED;
        },
        /**
         * Send Query to Mimir
         * @param {string} verb to call
         * @param {Object} args arguments to mimir
         * @param {function} cb after succes
         */
        sendQuery: function(verb, args, cb) {
            var self = this;
            TYPO3.Annotate.Server.mimirQuery(
                verb,
                args,
                function(result){
                    cb.bind(self);
                    var json = $.parseJSON(result);
                    if (args.keepOriginal)
                    {
                        cb(null, json);
                    }
                    else
                    {
                        if (json.state == "SUCCESS")
                            cb(null, json.data);
                        else if (json.state == "ERROR")
                            cb(json.data);
                    }
                });
        },
        /**
         * Function to keep loading result counts until the query is finished
         */
        delayForResults: function() {
            var self =  this;
            async.whilst(
                function () { return self.isRunning();},
                function (callback) {
                    self.sendQuery('documentsCurrentCount', {queryId: self.queryId}, function(err, response) {
                        self.documentCurrentCount = Math.max(self.documentCurrentCount, response.value);
                        self.observe.trigger();
                    });
                    self.sendQuery('documentsCount', {queryId: self.queryId}, function(err, response) {
                        var val = response.value;
                        if (val != - 1)
                        {
                            self.documentCurrentCount = Math.max(val);
                            self.state = self.states.FINISHED;
                            self.downloadResults();
                            self.observe.trigger();
                        }
                        callback();
                    });
                }
            );
        },
        /**
         * Download all Results
         */
        downloadResults: function() {
            for (var i = 0; i < this.documentCurrentCount; ++i)
            {
                this.results.push({
                    uri: "Loading Uri",
                    text: "Loading Content",
                    index: i
                });
                this.sendQuery('renderDocument', {queryId: this.queryId, rank: i, keepOriginal: true}, (function (index, err, response) {
                    this.results[index].text = response;
                    this.observe.trigger();
                }).bind(this, i));
                this.sendQuery('documentMetadata', {queryId: this.queryId, rank: i}, (function(index, err, response) {
                    this.results[index].uri = response.documentURI;
                    this.observe.trigger();
                }).bind(this, i));
            }
        }
    };
    return Query;
});
