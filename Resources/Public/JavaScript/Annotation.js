/**
 * @fileOverview Model for a single annotation, directly tied to a span in the edited document, transistive values
 * @name Annotation.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Annotation', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe'
], function (
    React,
    Observe
) {
    /**
     * Constructor for annotation object
     * @param {Element} actual annotation span
     * @param {Object} editor wrapper for functions
     */
    function Annotation(span, editor) {
        this.span = span;
        this.editor = editor;
        span.annotation = this;
        // directAttributes observer
        // @type {Object}
        this.observe = new Observe();
        this.observer = new MutationObserver(this.observe.trigger.bind(this.observe));
        this.observer.observe(span, {
            attributes: true,
            attributeOldValue: true
        });
    }
    Annotation.prototype = {
        // @type {Element}
        span: null,
        // @type {string[]} attributes which are direct attributes of the span, otherwise they are accessed as hidden spans
        directAttributes: ['vocab', 'resource', 'typeof', 'aid'],
        // @type {string[]} editable attributes
        editableAttributes: ["vocab","resource","typeof"],
        /**
         * Delete this annotation and remove its span, actual model deletion will happen after the domobserver triggered
         */
        delete: function() {
            this.editor.unwrapElement(this.span);
        },
        /**
         * Set attribute value, auto route saveplace
         * @param {string} name
         * @param {} value
         */
        set: function(name, value) {
            if (this.directAttributes.indexOf(name) != - 1)
            {
                this.span.setAttribute(name, value);
            }
            else
            {
            }
            this.observe.trigger();
        },
        /**
         * get annotation value
         * @param {string} name
         * @returns {}
         */
        get: function(name) {
            if (this.directAttributes.indexOf(name) != - 1)
            {
                return this.span.hasAttribute(name) && this.span.getAttribute(name);
            }
            else
            {
                return "";
            }
        },
        /**
         * get short description of the annotation
         * @returns {string}
         */
        short: function() {
            return this.get('resource').split('/').pop();
        }
    };
    return Annotation;
});
