define('TYPO3/CMS/Annotate/Editor', [
], function (
) {
    function Abs(){
        this.applyHooks();
    }
    Abs.prototype = {
        constructor: Abs,
        createAnnotationAroundSelection: function() {
            var range = this.getSelectedRange(),
                doc = this.getDocument(),
                ele = doc.createElement("span");
            ele.setAttribute('vocab',"New Annotation");
            ele.setAttribute('resource',"New Annotation");
            ele.setAttribute('typeof',"New Annotation");
            range.surroundContents(ele);
        },
        getSelectedRange: function() {
            return null;
        },
        getDocument: function() {
            return null;
        },
        applyHooks: function() {
        },
        getAnnotationList: function() {
            return document.getElementsByClassName("annotate-list")[0];
        }
    };
    function Htmlarea(htmlarea) {
        this.htmlarea = htmlarea;
        Abs.call(this);
    }
    Htmlarea.prototype = Object.create(Abs.prototype);
    Htmlarea.prototype.constructor = Htmlarea;
    Htmlarea.prototype.getSelectedRange = function() {
        return this.htmlarea.getSelectionRanges()[0];
    };
    Htmlarea.prototype.unwrapElement = function(element) {
        this.htmlarea.getDomNode().removeMarkup(element);
    };
    Htmlarea.prototype.getDocument = function() {
        return this.htmlarea.document;
    };

    Htmlarea.prototype.applyHooks = function() {
        var focus_ = this.htmlarea.focus.bind(this.htmlarea),
            setHTML_ = this.htmlarea.setHTML.bind(this.htmlarea),
            editor =  this;
        this.htmlarea.focus = function() {
            // the htmlarea undo functionality will refocus on the editor if we change an annotation attribute
            if (! editor.getAnnotationList().contains(document.activeElement))
                focus_();
        };
        this.htmlarea.setHTML = function() {
            setHTML_.apply(editor, arguments);
            if (editor.store)
                editor.store.reset();
        };

    };
    return {
        Htmlarea: Htmlarea
    };
});
