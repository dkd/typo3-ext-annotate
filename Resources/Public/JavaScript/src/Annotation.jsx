define('TYPO3/CMS/Annotate/Annotation', [
    'TYPO3/CMS/Annotate/react',
], function (React) {
    function Annotation(span) {
        if (!(this instanceof Annotation))
            throw new TypeError("Annotation constructor cannot be called as a function.");
        this.span = span;
        span.annotation = this;
        this.scan();
        this.observer = new MutationObserver(this.scan.bind(this));           
        this.observer.observe(span, {
            attributes: true,
            attributeOldValue: true
        });
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
            console.log(this.vocab,this.resource,this.typeof);
        }
    };
    return Annotation;
});
