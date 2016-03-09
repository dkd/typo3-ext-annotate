/**
 * @fileOverview SearchUI
 * @name SearchUI.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/SearchUI', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/LoadingIndicator',
    'TYPO3/CMS/Annotate/Query',
    'TYPO3/CMS/Annotate/Observe',
    'TYPO3/CMS/Aggregation/Aggregation',
    'TYPO3/CMS/Annotate/Remote'
], function (
    React,
    LoadingIndicator,
    Query,
    Observe,
    Aggregation,
    Remote
) {
    return React.createClass({
        displayName: 'SearchUI',
        mixins: [Observe.Mixin('query')],
        getInitialState: function() {
            return {
                input: "",
                query: new Query("")
            };
        },
        onChange: function(event) {
            this.state.query.update(event.target.value);
        },
        onQuery: function(event) {
            Aggregation.logSimple("SEM_SEARCH_QUERY", {query: this.state.query.raw});
            this.state.query.run();
        },
        onNew: function(event) {
            var obs = this.state.query.observe.observers;
            var ns = this.getInitialState();
            ns.query.observe = this.state.query.observe;
            this.replaceState(ns);
        },
        onView: function(result) {
            var query = this.state.query;
            return function (event) {
                Remote.resolveId(result.id, function(err, ret){
                    if (!err && ret)
                    {
                        Aggregation.log("SEM_SEARCH_CLICK", ret.typo3_table, ret.typo3_uid, {query: query.raw});
                        window.open(ret.base + "&edit[" + ret.typo3_table +  "][" +  ret.typo3_uid + "]=edit");
                    }
                });
            };
        },
        render: function() {
            var ready =  this.state.query.isReady(),
                running = this.state.query.isRunning(),
                finished = this.state.query.isFinished();
            return React.createElement("div", {className: "mimir"},
                React.createElement("h2", null,  "Welcome to your Mimir Search"),
                React.createElement('textarea', {
                    className: 'bar',
                    value: this.state.query.raw,
                    onChange: this.onChange
                }),
                React.createElement('button', {
                    className: 'run',
                    disabled: !this.state.query.isValid(),
                    onClick: this.onQuery
                }, 'Query!'),
                React.createElement('button', {
                    className: 'new',
                    onClick: this.onNew
                }, 'Clear'),
                React.createElement('textarea', {
                    className: 'bar transformed',
                    readOnly:true,
                    value: this.state.query.transformed
                }),
                !(running || finished) ? null:
                React.createElement("div", {
                    className: 'results'
                },
                  !running ? null : [
                      this.state.query.queryId,
                      React.createElement(LoadingIndicator, {className: 'loading'}),
                      this.state.query.documentCurrentCount
                  ],
                  !finished ? null : [
                      "Showing " +  this.state.query.documentCurrentCount + " results for queryId: " + this.state.query.queryId,
                      this.state.query.results.map((function (result) {
                          return React.createElement("div",
                              {
                                  className: "result",
                                  key: result.index,
                                  onClick: this.onView(result)
                              },
                              React.createElement("p", {className: "resultText", dangerouslySetInnerHTML: {__html: result.text.split('style="background-color: rgb(255, 135, 0);"').join('')}})
                             );
                      }).bind(this))
                  ]
                 )
               );
        }
    });
});
