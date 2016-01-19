/**
 * @fileOverview Mimir Functions
 * @name Mimir.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Mimir', [
    'jquery',
    'TYPO3/CMS/Annotate/Remote'
], function (
    $,
    Remote
) {
    return {
        /**
         * Send Query to Mimir
         * @param {string} verb to call
         * @param {Object} args arguments to mimir
         * @param {function} cb after succes
         */
        query: function(verb, args, cb) {
            Remote.query(
                verb,
                args,
                function(err, result){
                    cb.bind(self);
                    if (args.keepOriginal)
                    {
                        cb(null, result);
                    }
                    else
                    {
                        if (result.state == "SUCCESS")
                            cb(null, result.data);
                        else if (result.state == "ERROR")
                            cb(result.data);
                    }
                });
        },
        index: function (tablename, id, content, callback) {
            Remote.index(tablename, id, content, function (err, result) {
                callback(result);
            });
        }
    };
      });
