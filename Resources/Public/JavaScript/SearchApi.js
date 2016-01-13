/**
 * @fileOverview Search-Api
 * @name Search.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/SearchApi', [
    'TYPO3/CMS/Annotate/poly',
    'TYPO3/CMS/Annotate/react',
    'jquery',
    'TYPO3/CMS/Annotate/SearchUI'
], function (
    Poly,
    React,
    $,
    SearchUI
) {
    return {
        show: function(mountpoint) {
            React.render(React.createElement(SearchUI, {}), mountpoint);
        }
    };
});
