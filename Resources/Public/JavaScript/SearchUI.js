/** 
 * @fileOverview SearchUI
 * @name SearchUI.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/SearchUI', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/LoadingIndicator',
    'TYPO3/CMS/Annotate/Query',
    'TYPO3/CMS/Annotate/Observe'
], function (
    React,
    LoadingIndicator,
    Query,
    Observe
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
            this.state.query.run();
        },
        onNew: function(event) {
            var obs = this.state.query.observe.observers;
            var ns = this.getInitialState();
            ns.query.observe = this.state.query.observe;
            this.replaceState(ns);
        },
        render: function() {
            var ready =  this.state.query.isReady(),
                running = this.state.query.isRunning(),
                finished = this.state.query.isFinished();
            return React.createElement("div", {className: "annotate search"},
                React.createElement("p", null,  "Welcome to your Search"),
                React.createElement('button', {
                    onClick: this.onNew
                }, 'New!'),
                !ready ? null: [
                    React.createElement('input', {
                        type: 'text',
                        name: 'input',
                        value: this.state.query.raw,
                        onChange: this.onChange
                    }),
                    React.createElement('textarea', {
                        readOnly:true,
                        value: this.state.query.transformed
                    }),
                    React.createElement('button', {
                        onClick: this.onQuery
                    }, 'Query!'),
                ],
                !running ? null : [
                    this.state.query.queryId,
                    React.createElement(LoadingIndicator, null),
                    this.state.query.documentCurrentCount
                ],
                !finished ? null : [
                    "Showing " +  this.state.query.documentCurrentCount + " results for queryId: " + this.state.query.queryId,
                    this.state.query.results.map(function (result) {
                        return React.createElement("div", {
                            className: "result",
                            key: result.index
                        },
                            React.createElement("p", {}, "id: " + result.uri),
                            React.createElement("p", {dangerouslySetInnerHTML: {__html: result.text}})
                           );
                    })
                ]);
        }
    });
});
