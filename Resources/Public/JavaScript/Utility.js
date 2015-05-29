define('TYPO3/CMS/Annotate/Utility', [
    'TYPO3/CMS/Annotate/react',
], function (React) {
    return {
        isAnnotation: function(span) {
            return span.hasAttribute !== undefined && span.hasAttribute('vocab');
        },
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
