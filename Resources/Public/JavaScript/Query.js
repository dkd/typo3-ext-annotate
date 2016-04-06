/**
 * @fileOverview Query
 * @name Query.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Query', [
    'jquery',
    'TYPO3/CMS/Annotate/Observe',
    'TYPO3/CMS/Annotate/async',
    'TYPO3/CMS/Annotate/Utility',
    'TYPO3/CMS/Annotate/Mimir'
], function (
    $,
    Observe,
    A,
    Utility,
    Mimir
) {
    /**
     * Query Constructor
     */
    var Query = function(start){
        // @type {String}
        this.raw = start;
        // @type {String}
        this.transformed = this.queryize(this.raw);
        // @type {String}
        this.state = this.states.READY;
        // @type {Observe}
        this.observe =  new Observe();

        this.reset();
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
        /**
         * reset for a new query
         */
        reset: function () {
            // @type {String}
            this.queryId = "";
            // @type {Object[]}
            this.results = [];
            // @type {number}
            this.documentCurrentCount =  0;
        },
        url: function(verb) {
            return this.baseURL + verb;
        },
        /**
         * Add a default sparql prefix if applicable
         * @param {String} prefix
         * @param {String} name
         * @returns {String}
         */
        prefixed: function (prefix, name)
        {
            if (! isNaN(name))
                return name;
            if (name.substring(0,1) == "?")
                return name;
            if (name.substring(0,1) == "\"")
                return name;
            return name.indexOf(":") == -1 ? prefix + ":" + name : name;
        },
        /**
         * Transform an input string into a mimir query
         * @param {String} raw input
         * @returns {String} transformed query
         */
        queryize: function(raw) {
            var result = null,
                re = /\$([^\$]*)\$/g,
                template = "{Mention}",
                templateBegin = "\
{Mention sparql=\"\
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n\
PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
PREFIX dbo:<http://dbpedia.org/ontology/>\n\
PREFIX dbp:<http://dbpedia.org/property/>\n\
PREFIX dbr:<http://dbpedia.org/resource/>\n\
select distinct ?inst where {\n",
                templateEnd = "\n}\"}";

            while ((result = re.exec(raw)) !== null) {
                var begin = result.index,
                    end = re.lastIndex;

                var simple = raw.substring(begin + 1, end - 1);
                if (!/\S/.test(simple))
                    raw = Utility.replaceRange(raw, begin, end,  "{Mention}");
                else
                {
                    var complex = templateBegin;

                    simple = simple.split("\n");

                    simple =  simple.map(function(line){
                        if (line.substring(0, 6) == "FILTER")
                            return line;
                        line =  line.split(" ");
                        if (line.length == 1)
                            return "?inst a " + this.prefixed("dbo",line[0]) + " .";
                        else if (line.length == 2)
                            return "?inst " + this.prefixed("dbo",line[0]) +  " " +  this.prefixed("dbr",line[1]) + " .";
                        else if (line.length == 3)
                            return line[0] + " " + this.prefixed("dbo",line[1]) +  " " + this.prefixed("dbr",line[2]) + " .";
                        else
                            return "invalid line";
                    }, this);

                    complex += simple.join("\n");

                    complex += templateEnd;
                    raw = Utility.replaceRange(raw, begin, end,  complex);
                }
                re.lastIndex = 0;
            }
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
            this.reset();
            this.state = this.states.RUNNING;
            Mimir.query(
                "postQuery",
                {queryString: this.transformed},
                function (err, response) {
                    if (err || response == undefined || response.queryId === undefined)
                    {
                        TYPO3.Flashmessage.display(3, "ERROR", response);
                        self.state = self.states.ERROR;
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
         * Is the active query a valid query?
         * @returns {boolean}
         */
        isValid: function () {
            return /\S/.test(this.transformed);
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
            if (!this.isValid())
                return;
            var self = this;
            if (this.queryId)
                args.queryId = this.queryId;
        },
        /**
         * Function to keep loading result counts until the query is finished
         */
        delayForResults: function() {
            var self =  this;
            A.whilst(
                function () { return self.isRunning();},
                function (callback) {
                    Mimir.query('documentsCurrentCount', {queryId: self.queryId}, function(err, response) {
                        self.documentCurrentCount = Math.max(self.documentCurrentCount, response.value);
                        self.observe.trigger();
                    });
                    Mimir.query('documentsCount', {queryId: self.queryId}, function(err, response) {
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
            var self = this;
            A.each(Utility.range(self.documentCurrentCount), function (index,  callback) {
                self.results.push({
                    text: "Loading Content",
                    id: "Loading Id",
                    index: index
                });
                A.parallel([
                    function (callback) {
                        Mimir.query('renderDocument', {queryId: self.queryId, rank: index, keepOriginal: true}, function (err, response) {
                            self.results[index].text = response;
                            self.observe.trigger();
                            callback();
                        });
                    },
                    function (callback) {
                        Mimir.query('documentId', {rank: index, queryId: self.queryId}, function(err, response) {
                            self.results[index].id = response.value;
                            self.observe.trigger();
                            callback();
                        });
                    }
                ], callback);
            }, function (err) {
                Mimir.query('close', {queryId: self.queryId}, function(err, response) {
                    console.log("closed query");
                });
            });
        }
    };
    return Query;
});
