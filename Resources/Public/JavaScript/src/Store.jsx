define('TYPO3/CMS/Annotate/Store', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Utility',
    'TYPO3/CMS/Annotate/Annotation'
], function (
    React,
    Utility,
    Annotation
) {
    function Store(document) {
        if (!(this instanceof Store))
            throw new TypeError("Store constructor cannot be called as a function.");
        this.doc = document;
        this.annotations = [];
        this.observer = new MutationObserver(this.mutated.bind(this));           
        var config = { childList: true, subtree: true };
        this.observer.observe(document.body, config);
        Utility.nodeListForEach(document.body.querySelectorAll("[vocab]"), this.addAnnotation.bind(this));
    };
    Store.prototype = {
        constructor: Store,
        doc: null,
        observer: null,
        annotations: null,
        mutated: function(mutations) {
            mutations.forEach(function(mutation){
                Utility.nodeListForEach(mutation.addedNodes, this.addAnnotation, this);
                Utility.nodeListForEach(mutation.removedNodes, this.removeAnnotation, this);
            },this);
        },
        addAnnotation: function(span) {
            if (!Utility.isAnnotation(span))
                return;
            console.log('add ' + span);
            this.annotations.push(new Annotation(span));
            this.status();
        },
        removeAnnotation: function(span) {
            if (!Utility.isAnnotation(span))
                return;
            console.log('remove ' + span);
            this.annotations.remove(span.annotation);
            this.status();
        },
        status: function() {
            this.annotations.forEach(console.log, console);
        },
        unobserve: function() {
            this.observer.disconnect();
        }
    };
    return Store;
});
