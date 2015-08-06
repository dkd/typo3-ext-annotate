/**
 * @fileOverview SearchUI
 * @name SearchUI.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/SearchUI', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/LoadingIndicator',
    'TYPO3/CMS/Annotate/Queryize'
], function (
    React,
    LoadingIndicator,
    Queryize
) {
    return React.createClass({
        displayName: 'SearchUI',
        getInitialState: function() {
            return {
                input: "",
                query: Queryize(""),
                querying: false
            };
        },
        onChange: function(event) {
            this.setState({
                input: event.target.value,
                    // async that?
                query: Queryize(event.target.value)
            });
        },
        onQuery: function(event) {
            this.setState({
                querying: true
            });
        },
        render: function() {
            return React.createElement("div", {className: "annotate search"},
                React.createElement("p", null,  "Welcome to your Search"),
                this.state.querying ? null:
                React.createElement('input', {
                    type: 'text',
                    name: 'input',
                    value: this.state.input,
                    onChange: this.onChange
                }),
                this.state.querying ? null:
                React.createElement('textarea', {
                    readOnly:true,
                    value: this.state.query
                }),
                this.state.querying ? null:
                React.createElement('button', {
                    onClick: this.onQuery
                }, 'Query!'),
                !this.state.querying ? null:
                "qzery"
               );
        }
    });
});
