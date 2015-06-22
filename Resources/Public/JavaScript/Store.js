/**
 * @fileOverview Store for all annotations of the edited document
 * @name Store.js
 * @author Johannes Goslar
 */
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
    /**
     * Store Constructor
     * @param {HTMLDocument} document
     * @param {Object} editor
     */
    function Store(document, editor) {
        this.observe = new Observe();
        this.editor = editor;
        this.editor.store =  this;
        this.reset();
    };

    /**
     * Generate a (fake) guid for an annotation
     * @returns {string}
     */
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    Store.prototype = {
        constructor: Store,
        doc: null,
        observer: null,
        observers: null,
        annotations: null,
        /**
         * Reset this store e.g. when html is set directly
         */
        reset: function() {
            this.doc = this.editor.getDocument();
            this.annotations = [];

            if (this.observer)
                this.observer.disconnect();

            this.observer = new MutationObserver(this.mutated.bind(this));
            var config = { childList: true, subtree: true };
            this.observer.observe(this.doc.body, config);

            Utility.nodeListForEach(this.doc.body.querySelectorAll("[vocab]"), this.addAnnotation.bind(this));
        },
        /**
         * MutationObserver callback, check if annotations were created/deleted
         * @param {} mutations
         */
        mutated: function(mutations) {
            mutations.forEach(function(mutation){
                Utility.nodeListForEach(mutation.addedNodes, this.addAnnotation, this);
                Utility.nodeListForEach(mutation.removedNodes, this.removeAnnotation, this);
            },this);
        },
        /**
         * Create a model when a new span was detected
         * @param {Element} span
         */
        addAnnotation: function(span) {
            if (!Utility.isAnnotation(span))
                return;

            if (!span.hasAttribute('aid'))
                span.setAttribute('aid', guid());

            console.log('add ' + span);

            this.annotations.push(new Annotation(span,this.editor));
            this.status();
            this.observe.trigger();
        },
        /**
         * Remove annotation when a span got deleted
         * @param {Element} span
         */
        removeAnnotation: function(span) {
            if (!Utility.isAnnotation(span))
                return;
            console.log('remove ' + span);
            this.annotations.remove(span.annotation);
            this.status();
            this.observe.trigger();
        },
        /**
         * Show some status on the console
         */
        status: function() {
            this.annotations.forEach(console.log, console);
        }
    };
    return Store;
});
