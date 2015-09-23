/**
 * @fileOverview Aggregation Extension Wrapper
 * @name Aggregate.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Aggregate', [
], function (
) {
    return function (table, uid) {
        return function (action, additionalData) {
            if (TYPO3.Aggregation && TYPO3.Aggregation.UsageTrackingService  && TYPO3.Aggregation.UsageTrackingService.log)
            {
                TYPO3.Aggregation.UsageTrackingService.log(action, table, uid, additionalData, function () {
                });
            }
        };
    };
});
