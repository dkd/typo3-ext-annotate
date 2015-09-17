/**
 * @fileOverview Model for a single annotation, directly tied to a span in the edited document, transistive values
 * @name Annotation.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Annotation', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe',
    'TYPO3/CMS/Annotate/Properties'
], function (
    React,
    Observe,
    Properties
) {
    /**
     * Constructor for annotation object
     * @param {Element} actual annotation span
     * @param {Object} editor wrapper for functions
     */
    function Annotation(span, editor) {
        this.span = span;
        this.editor = editor;
        this.blinking = false;
        span.annotation = this;
        // directAttributes observer
        // @type {Object}
        this.observe = new Observe();
        this.observer = new MutationObserver(this.observe.trigger.bind(this.observe));
        this.observer.observe(span, {
            attributes: true,
            attributeOldValue: true
        });
        this.properties = new Properties(this.observe, this.editor);
    }
    Annotation.prototype = {
        // @type {Element}
        span: null,
        // @type {string[]} attributes which are direct attributes of the span, otherwise they are accessed as hidden spans
        directAttributes: ['vocab', 'resource', 'typeof', 'aid'],
        // @type {string[]} editable attributes
        editableAttributesBase: ["vocab","resource","typeof"],
        /**
         * Returns all editable Attributes in edit order
         */
        editableAttributes: function() {
            return this.editableAttributesBase;
        },
        /**
         * Delete this annotation and remove its span, actual model deletion will happen after the domobserver triggered
         */
        delete: function() {
            this.properties.unwrapAll();
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
                if (value)
                    this.span.setAttribute(name, value);
                else
                    this.span.removeAttribute(name);
            }
            else
            {
                if (value)
                    this.properties.findByName(name).textContent = value;
                else
                    this.properties.unwrap(name);
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
                var span = this.properties.findByName(name);
                return span ? span.textContent : undefined;
            }
        },
        /**
         * get short description of the annotation
         * @returns {string}
         */
        short: function() {
            // @type {string}
            var ret =this.get('resource');
            if (ret)
                ret = ret.split('/').pop();
            else
                ret = this.get('name') || this.get('typeof');

            if (ret && ret.length > 50)
                ret = ret.substring(0, 50) +  "...";

            return ret || "New";
        },
        /**
         * Yeah, we want that.
         */
        toggleBlink: function() {
            if (!this.blinking)
                this.blinking = true, this.span.style.backgroundColor = '#FF8700';
            else
                this.blinking = false, this.span.style.backgroundColor = null;
        }
    };
    return Annotation;
});
