/**
 * @fileOverview Show a LoadingIndicator
 * @name LoadingIndicator.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/LoadingIndicator', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/spin'
], function (
    React,
    Spinner
) {
    return React.createClass({
        displayName: 'LoadingIndicator',
        render: function() {
            return (React.createElement("div", {
                ref: function(component) {
                    if (component)
                        React.findDOMNode(component).appendChild((new Spinner({left: null, top: null})).spin().el);
                }}));
        }
    });
});
