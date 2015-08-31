/**
 * @fileOverview Mimir Functions
 * @name Mimir.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Mimir', [
    'jquery',
], function (
    $
) {
    return {
        /**
         * Send Query to Mimir
         * @param {string} verb to call
         * @param {Object} args arguments to mimir
         * @param {function} cb after succes
         */
        query: function(verb, args, cb) {
            TYPO3.Annotate.Server.mimirQuery(
                verb,
                args,
                function(result){
                    cb.bind(self);
                    var json = $.parseJSON(result);
                    if (args.keepOriginal)
                    {
                        cb(null, json);
                    }
                    else
                    {
                        if (json.state == "SUCCESS")
                            cb(null, json.data);
                        else if (json.state == "ERROR")
                            cb(json.data);
                    }
                });
        },
        index: function (tablename, id, content, callback) {
            TYPO3.Annotate.Server.index(tablename, id, content, function (result) {
                callback($.parseJSON(result));
            });
        }
    };
});
