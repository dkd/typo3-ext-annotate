define('TYPO3/CMS/Annotate/Annotation', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe'
], function (
    React,
    Observe
) {
    function Annotation(span, editor) {
        if (!(this instanceof Annotation))
            throw new TypeError("Annotation constructor cannot be called as a function.");

        this.span = span;
        this.editor = editor;
        span.annotation = this;
        // directAttributes observer
        this.observe = new Observe();
        this.observer = new MutationObserver(this.observe.trigger.bind(this.observe));
        this.observer.observe(span, {
            attributes: true,
            attributeOldValue: true
        });
        // indirect attributes


    }
    Annotation.prototype = {
        span: null,
        directAttributes: ['vocab', 'resource', 'typeof', 'aid'],
        editableAttributes: ["vocab","resource","typeof"],
        delete: function() {
            this.editor.unwrapElement(this.span);
        },
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
        short: function() {
            return this.get('resource').split('/').pop();
        }
    };
    return Annotation;
});
