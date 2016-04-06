/**
 * @fileOverview SearchUI
 * @name SearchUI.js
 * @author Johannes Goslar
 */

define('React', ['TYPO3/CMS/Annotate/react'], function(React){
    return React;
});

define('ReactDOM', ['TYPO3/CMS/Annotate/react'], function(React){
    return React;
});

define('TYPO3/CMS/Annotate/SearchUI', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/react-tab',
    'TYPO3/CMS/Annotate/LoadingIndicator',
    'TYPO3/CMS/Annotate/Query',
    'TYPO3/CMS/Annotate/Observe',
    'TYPO3/CMS/Aggregation/Aggregation',
    'TYPO3/CMS/Annotate/Remote'
], function (
    React,
    ReactTab,
    LoadingIndicator,
    Query,
    Observe,
    Aggregation,
    Remote
) {
    var Tab = ReactTab.Tab,
        Tabs = ReactTab.Tabs,
        TabList = ReactTab.TabList,
        TabPanel = ReactTab.TabPanel;

    return React.createClass({
        displayName: 'SearchUI',
        mixins: [Observe.Mixin('query')],
        getInitialState: function() {
            return {
                input: "",
                query: new Query("$$"),
                beginner: 'all',
                beginnerType: 'Fish'
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
        onBeginnerSelect: function (event) {
            var val = event.target.value;
            this.setState({beginner: val});
            this.state.query.update(val == 'all' ? '$$': '$' + this.state.beginnerType +'$');
        },
        onBeginnerType: function (event) {
            var val = event.target.value;
            this.setState({beginnerType: val});
            this.state.query.update('$' + val +'$');
        },
        render: function() {
            var ready =  this.state.query.isReady(),
                running = this.state.query.isRunning(),
                finished = this.state.query.isFinished();
            return React.createElement('div',{className: "mimir"},
                React.createElement("h2", null,  "Welcome to your Mimir Search"),
                React.createElement(Tabs, {},
                  React.createElement(TabList,  {},
                    React.createElement(Tab, {}, "Normal"),
                    React.createElement(Tab, {}, "Advanced")
                   ),
                  React.createElement(TabPanel, {},
                    React.createElement('h2', {}, 'What are you looking for?'),
                    React.createElement('input', {type: 'radio', checked: this.state.beginner == 'all',  value: 'all', onChange: this.onBeginnerSelect}), ' All entities!',
                    React.createElement('br', {}),
                    React.createElement('input', {type: 'radio', checked: this.state.beginner == 'type', value: 'type', onChange: this.onBeginnerSelect}), ' All of type: ',
                    React.createElement('input', {value: this.state.beginnerType, onChange: this.onBeginnerType, disabled: this.state.beginner == 'all'}),
                    React.createElement('br', {}),
                    React.createElement('button', {
                        className: 'run',
                        disabled: !this.state.query.isValid(),
                        onClick: this.onQuery
                    }, 'Query!')
                   ),
                  React.createElement(TabPanel, {},
                    React.createElement('textarea', {
                        className: 'bar',
                        value: this.state.query.raw,
                        onChange: this.onChange
                    }),
                    React.createElement('br', {}),
                    React.createElement('textarea', {
                        className: 'bar transformed',
                        readOnly:true,
                        value: this.state.query.transformed
                    }),
                    React.createElement('br', {}),
                    React.createElement('button', {
                        className: 'run',
                        disabled: !this.state.query.isValid(),
                        onClick: this.onQuery
                    }, 'Query!')
                   )),
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
