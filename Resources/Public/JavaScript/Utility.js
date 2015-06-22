/**
 * @fileOverview Some Utility functions for Annotate
 * @name Utility.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Utility', [
    'TYPO3/CMS/Annotate/react',
], function (React) {
    return {
        /**
         * Is the span an annotation
         * @param {Element} span
         * @returns {boolean}
         */
        isAnnotation: function(span) {
            return span.hasAttribute !== undefined && span.hasAttribute('vocab');
        },
        /**
         * Iterate over a NodeList
         * @param {NodeList} nodelist
         * @param {function} cb
         * @param {Object} context
         */
        nodeListForEach: function(nodelist, cb, context) {
            for (var i = 0; i < nodelist.length; ++i) {
                var item = nodelist[i];
                if (context !== undefined)
                    cb.bind(context)(item);
                else
                    cb(item);
            }
        }
    };
});
