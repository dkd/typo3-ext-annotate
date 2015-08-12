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
            return " " +  raw +  " ";
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
                            self.documentCurrentCount = val;
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
            var self =  this;
            for (var i = 0; i < self.documentCurrentCount; i++)
            {
                this.results.push({
                    uri: "Loading Uri",
                    text: "Loading Content",
                    index: i
                });
                var index = i;
                this.results[i] = {
                    text: "loading result",
                    uri: "<>"
                };
                self.sendQuery('renderDocument', {queryId: self.queryId, rank: i, keepOriginal: true}, function(err, response) {
                    self.results[index].text = response;
                    self.observe.trigger();
                });
                self.sendQuery('documentId', {queryId: self.queryId, rank: i}, function(err, response) {
                    self.results[index].uri = response.value;
                    self.observe.trigger();
                });
            }
        }
    };
    return Query;
});
