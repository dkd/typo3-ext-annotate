define('TYPO3/CMS/Annotate/Editor', [
], function (
) {
    function Abs(){
    }
    Abs.prototype = {
        constructor: Abs
    };
    function Htmlarea(htmlarea) {
        this.htmlarea = htmlarea;
        this.dom = htmlarea.getDomNode();
    }
    Htmlarea.prototype = Object.create(Abs.prototype);
    Htmlarea.prototype.constructor = Htmlarea;
    Htmlarea.prototype.wrapSelection = function() {

    };
    Htmlarea.prototype.unwrapElement = function(element) {
        this.dom.removeMarkup(element);
    };
    return {
        Htmlarea: Htmlarea
    };
});
