/**
 * @fileOverview Ontoaut-Api for the Ontoaut-Lib
 * @name Api.js
 * @author Johannes Goslar
 */
// provide typo3 define into the webpacked file
window.TYPO3define = define;
define('TYPO3/CMS/Annotate/OntoautApi', [
    'TYPO3/CMS/Annotate/OntoautLib'
], function (
    OntoautLib
) {
    // we do not need that anymore, OntoautLib is ours
    delete window.TYPO3define;
    return {
        mount: function()
        {
            OntoautLib.mount();
        }
    };
});
