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
            var config = {childList: true, subtree: true};
            this.observer.observe(this.doc.body, config);

            Utility.nodeListForEach(this.doc.body.querySelectorAll("[vocab]"), this.handleAddition.bind(this));
            Utility.nodeListForEach(this.doc.body.querySelectorAll("[property]"), this.handleAddition.bind(this));

            this.observe.trigger();
        },
        /**
         * MutationObserver callback, check if annotations were created/deleted
         * @param {MutationRecord[]} mutations
         */
        mutated: function(mutations) {
            mutations.forEach(function(mutation){
                Utility.nodeListForEach(mutation.addedNodes, this.handleAddition, this);
                Utility.nodeListForEach(mutation.removedNodes, this.handleRemoval, this);
            },this);
        },
        /**
         * Create a model when a new span was detected
         * @param {Element} span
         */
        handleAddition: function(span) {
            if (Utility.isAnnotation(span))
            {
                if (!span.hasAttribute('aid'))
                    span.setAttribute('aid', Utility.guid());

                this.annotations.push(new Annotation(span,this.editor));
                this.status();
                this.observe.trigger();
            }
            else if (Utility.isProperty(span))
            {
                if (!span.hasAttribute('aid'))
                    span.setAttribute('aid', Utility.guid());

                var ann = this.findAnnotationForProperty(span);
                ann.properties.add(span, ann);
                this.observe.trigger();
            }
        },
        /**
         * Remove annotation when a span got deleted
         * @param {Element} span
         */
        handleRemoval: function(span) {
            if (Utility.isAnnotation(span))
            {
                this.annotations.remove(span.annotation);
                this.status();
                this.observe.trigger();
            }
            else if (Utility.isProperty(span))
            {
                span.annotation.properties.remove(span);
                this.observe.trigger();
            }
        },
        /**
         * Find nearest annotation
         * @param {Element} span
         * @returns {Annotation}
         */
        findAnnotationForProperty: function(span) {
            while (span && !Utility.isAnnotation(span))
                span = span.parentElement;
            return span ? span.annotation : null;
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
