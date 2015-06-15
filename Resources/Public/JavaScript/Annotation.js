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
        this.observe = new Observe();
        this.observer = new MutationObserver(this.scan.bind(this));

        this.observer.observe(span, {
            attributes: true,
            attributeOldValue: true
        });
        this.scan();
    }
    Annotation.prototype = {
        span: null,
        vocab: null,
        resource: null,
        typeof: null,
        aid:  null,
        scan: function(mutations) {
            this.vocab = this.span.hasAttribute('vocab') && this.span.getAttribute('vocab');
            this.resource = this.span.hasAttribute('resource') && this.span.getAttribute('resource');
            this.typeof = this.span.hasAttribute('typeof') && this.span.getAttribute('typeof');
            this.aid = this.span.hasAttribute('aid') && this.span.getAttribute('aid');
            this.observe.trigger();
        },
        delete: function() {
            this.editor.unwrapElement(this.span);
        }
    };
    return Annotation;
});
