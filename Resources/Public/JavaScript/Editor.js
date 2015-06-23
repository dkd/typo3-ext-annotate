/**
 * @fileOverview Editor wrapper for functions manipulating the edited document
 * @name Editor.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Editor', [
], function (
) {
    /**
     * Abstract Editor Wrapper Constructor
     */
    function Abs(){
        this.applyHooks();
    }
    Abs.prototype = {
        constructor: Abs,
        /**
         * Create new annotation around the currently selected text
         */
        createAnnotationAroundSelection: function() {
            var range = this.getSelectedRange(),
                doc = this.getDocument(),
                ele = doc.createElement("span");
            ele.setAttribute('vocab',"New Annotation");
            ele.setAttribute('resource',"New Annotation");
            ele.setAttribute('typeof',"New Annotation");
            range.surroundContents(ele);
        },
        /**
         * Get currently selected range from the editor
         * @returns {Range}
         */
        getSelectedRange: function() {
            return null;
        },
        /**
         * Get editied document
         * @returns {Document}
         */
        getDocument: function() {
            return null;
        },
        /**
         * Apply/insert editor specific hooks, done on init
         */
        applyHooks: function() {
        },
        /**
         * Get current instance of the list view
         * @returns {Element}
         */
        getAnnotationList: function() {
            var lists = document.getElementsByClassName("annotate-list");
            if (lists.length > 0)
                return lists[0];
            return null;
        },
        /**
         * Get the whole content of the edited document as string
         * @returns {string}
         */
        getContent: function() {
            return null;
        },
        /**
         * Set document content to the given html document
         * @param {string} content
         */
        setContent: function(content) {
        },
        /**
         * Automatically annotate the whole content
         * @param {function} cb
         */
        autoAnnotate: function(cb) {
        },
        /**
         * Add hidden property to annotation span
         * @param {Element} span
         */
        addPropertyHidden: function(span) {
            var ele = this.getDocument().createElement("span");
            ele.setAttribute("hidden","true");
            ele.setAttribute("property","New Property");
            ele.innerHTML = "New Value";
            span.insertBefore(ele, span.firstChild);
        },
        /**
         * Add property around selection
         */
        addPropertyAroundSelection: function() {
            var range = this.getSelectedRange(),
                doc = this.getDocument(),
                ele = doc.createElement("span");
            ele.setAttribute("property","New Property");
            range.surroundContents(ele);
        }
    };
    /**
     * Htmlarea Wrapper Constructor
     * @param {Object} api
     * @param {Object} htmlarea
     */
    function Htmlarea(api, htmlarea) {
        this.htmlarea = htmlarea;
        this.api = api;
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

    Htmlarea.prototype.setContent = function(content) {
        this.htmlarea.setHTML(content);
    };

    Htmlarea.prototype.getContent = function() {
        return this.htmlarea.getInnerHTML();
    };

    Htmlarea.prototype.applyHooks = function() {
        var focus_ = this.htmlarea.focus.bind(this.htmlarea),
            setHTML_ = this.htmlarea.setHTML.bind(this.htmlarea),
            setMode_ = this.htmlarea.setMode.bind(this.htmlarea),
            editor =  this;
        this.htmlarea.focus = function() {
            // the htmlarea undo functionality will refocus on the editor if we change an annotation attribute
            if (editor.getAnnotationList() && !editor.getAnnotationList().contains(document.activeElement))
                focus_();
        };
        this.htmlarea.setHTML = function() {
            setHTML_.apply(editor, arguments);
            if (editor.store)
                editor.store.reset();
        };
        var previous = false;
        this.htmlarea.setMode = function(mode) {
            if (mode != 'wysiwyg')
            {
                previous = editor.getAnnotationList() != null;
                editor.api.hide();
            }
            else if (previous)
                editor.api.show();
            setMode_(mode);
            if (editor.store)
                editor.store.reset();
        };
    };
    Htmlarea.prototype.autoAnnotate = function(cb) {
        var input = this.getContent(),
            table = 0, //this.editorConfiguration.buttonsConfig.AnnotateButton.table,
            uid = 0, //uid = this.editorConfiguration.buttonsConfig.AnnotateButton.uid;
            editor =  this;

        TYPO3.Annotate.Server.annotateText(input, table, uid, (function(result){
            editor.setContent(result);
            cb();
        }));
    };

    return {
        Htmlarea: Htmlarea
    };
});
