define('TYPO3/CMS/Annotate/Annotation', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe'
], function (
    React,
    Observe
) {
    function Annotation(span,id) {
        if (!(this instanceof Annotation))
            throw new TypeError("Annotation constructor cannot be called as a function.");
        this.span = span;
        this.id = id;
        span.annotation = this;
        this.observe = new Observe();
        this.observer = new MutationObserver(this.scan.bind(this));
        this.observer.observe(span, {
            attributes: true,
            attributeOldValue: true
        });
        this.scan();
    };
    Annotation.prototype = {
        span: null,
        vocab: null,
        resource: null,
        typeof: null,
        scan: function(mutations) {
            this.vocab = this.span.hasAttribute('vocab') && this.span.getAttribute('vocab');
            this.resource = this.span.hasAttribute('resource') && this.span.getAttribute('resource');
            this.typeof = this.span.hasAttribute('typeof') && this.span.getAttribute('typeof');
            this.observe.trigger();
        }
    };
    return Annotation;
});
