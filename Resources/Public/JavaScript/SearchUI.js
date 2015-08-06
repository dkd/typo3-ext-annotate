/**
 * @fileOverview SearchUI
 * @name SearchUI.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/SearchUI', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/LoadingIndicator'
], function (
    React,
    LoadingIndicator
) {
    return React.createClass({
        displayName: 'SearchUI',
        getInitialState: function() {
            return {
            };
        },
        render: function() {
            return React.createElement("div", {className: "annotate"},
                React.createElement("p", null,  "Welcome to your Search")
               );
        }
    });
});
