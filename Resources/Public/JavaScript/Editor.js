/**
 * @fileOverview Editor wrapper for functions manipulating the edited document
 * @name Editor.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Editor', [
    'TYPO3/CMS/Aggregation/Aggregation',
    'TYPO3/CMS/Annotate/Mimir',
    'TYPO3/CMS/Annotate/Remote'
], function (
    Aggregation,
    Mimir,
    Remote
) {
    /**
     * Abstract Editor Wrapper Constructor
     */
    function Abs(){
        this.applyHooks();
    }
    Abs.prototype = {
        constructor: Abs,
        insertCount: 1,
        /**
         * Create new annotation around the currently selected text
         */
        createAnnotationAroundSelection: function() {
            var range = this.getSelectedRange(),
                doc = this.getDocument(),
                ele = doc.createElement('span');
            ele.setAttribute('vocab', 'http://dbpedia.org/ontology/');
            ele.setAttribute('typeof','Set Me');
            ele.newlyCreated = this.insertCount++;
            range.surroundContents(ele);
            return ele;
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
         * Index the whole content
         * @param {function} cb
         */
        autoIndex: function(cb) {
            var input = this.getContent(),
                id = this.getContentId(),
                editor = this;
            Mimir.index(this.getContentTable(), this.getContentId(), this.getContent(), cb);
        },
        /**
         * Index the whole content
         * @param {function} cb
         */
        analyze: function(cb) {
            Remote.analyze(this.getContentTable(), this.getContentId(), this.getContent(), cb);
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
        },
        /**
         * Get wished for list height
         * @returns {number} height
         */
        getWishedListHeigth: function() {
            return 0;
        },
        /**
         * Get Total Editor Wrap
         * @returns {Element} wrap
         */
        getWrap: function() {
            return null;
        },
        /**
         * get content id
         * @returns {string} id for the content
         */
        getContentId: function () {
            return "";
        },
        getContentTable: function () {
            return "";
        },
        aggregate: function () {
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
        return this.htmlarea.getSelection().selection.getRangeAt(0);
    };

    Htmlarea.prototype.unwrapElement = function(element) {
        this.aggregate("ANNOTATE_REMOVE", {text: element.innerHTML});
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
            editor =  this;

        Remote.annotate(input, (function(err, result){
            if (!err)
                editor.setContent(result);
            cb();
        }));
    };

    Htmlarea.prototype.getWishedListHeigth = function() {
        var editorWrap = this.getWrap(),
            headerHeight = 180;
        return editorWrap.getHeight() -  180;
    };

    Htmlarea.prototype.getWrap = function() {
        return document.getElementsByClassName("editorWrap")[0];
    };

    Htmlarea.prototype.getContentId = function () {
        return this.htmlarea.config.buttons.showAnnotate.id;
    };

    Htmlarea.prototype.getContentTable = function () {
        return this.htmlarea.config.buttons.showAnnotate.table;
    };

    Htmlarea.prototype.aggregate = function (action, additionalData) {
        if (additionalData == null)
            additionalData =  {};
        Aggregation.log(action, this.getContentTable(), this.getContentId(), additionalData);
    };

    return {
        Htmlarea: Htmlarea
    };
});
