define('TYPO3/CMS/Annotate/Model', [
    'TYPO3/CMS/Annotate/react',
], function (React) {
    function Model(document) {
        if (!(this instanceof Model))
            throw new TypeError("Model constructor cannot be called as a function.");
        this.doc = document;
        this.annotations = [];
        this.observer = new MutationObserver(this.mutated);           
        var config = { childList: true, subtree: true };
        this.observer.observe(document.body, config);       
    };
    Model.prototype = {
        constructor: Model,
        doc: null,
        observer: null,
        annotations: null,
        mutated: function(mutations) {
            mutations.forEach(function(mutation) {
                

                
            });    
        },
            unobserve: function() {
                this.observer.disconnect();
            }
        };
        return Model;
});
