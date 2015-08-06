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
    /**
     * SearchApi Constructor
     */
    var SearchApi = function(){
    };
    SearchApi.prototype = {
        // @type {Object}
        constructor: SearchApi,
        /**
         * Show search ui
         */
        show: function(mountpoint) {
            debugger;
            React.render(React.createElement(SearchUI, {}), mountpoint);
        }
    };
    return SearchApi;
});
