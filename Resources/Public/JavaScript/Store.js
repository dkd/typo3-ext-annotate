define('TYPO3/CMS/Annotate/Store', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Utility',
    'TYPO3/CMS/Annotate/Annotation',
    'TYPO3/CMS/Annotate/Observe'
], function (
    React,
    Utility,
    Annotation,
    Observe
) {
    function Store(document, editor) {
        if (!(this instanceof Store))
            throw new TypeError("Store constructor cannot be called as a function.");
        this.doc = document;
        this.editor = editor;
        this.annotations = [];

        this.observer = new MutationObserver(this.mutated.bind(this));
        var config = { childList: true, subtree: true };
        this.observer.observe(document.body, config);

        this.observe = new Observe();

        Utility.nodeListForEach(document.body.querySelectorAll("[vocab]"), this.addAnnotation.bind(this));
    };
    Store.prototype = {
        constructor: Store,
        doc: null,
        observer: null,
        observers: null,
        annotations: null,
        unobserve: function() {
            this.observer.disconnect();
        },
        mutated: function(mutations) {
            mutations.forEach(function(mutation){
                Utility.nodeListForEach(mutation.addedNodes, this.addAnnotation, this);
                Utility.nodeListForEach(mutation.removedNodes, this.removeAnnotation, this);
            },this);
        },
        nextId: function() {
            var id =(this.nextIdCounter === undefined) ? 1 : this.nextIdCounter;
            this.nextIdCounter = id +1;
            return id;
        },
        addAnnotation: function(span) {
            if (!Utility.isAnnotation(span))
                return;
            console.log('add ' + span);
            this.annotations.push(new Annotation(span,this.nextId(),this.editor));
            this.status();
            this.observe.trigger();
        },
        removeAnnotation: function(span) {
            if (!Utility.isAnnotation(span))
                return;
            console.log('remove ' + span);
            this.annotations.remove(span.annotation);
            this.status();
            this.observe.trigger();
        },
        status: function() {
            this.annotations.forEach(console.log, console);
        }
    };
    return Store;
});
