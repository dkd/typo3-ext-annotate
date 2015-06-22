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
            return (React.createElement("div",{
                className: 'annotate-list',
                ref: function(component) {
                    if (component)
                    {
                        var opts = {
                            className: 'spinner',
                            top: '50%',
                            left: '50%',
                            position: null
                        };
                        React.findDOMNode(component).appendChild((new Spinner(opts)).spin().el);
                    }
                }}));
        }
    });
});