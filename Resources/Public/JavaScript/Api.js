/**
 * @fileOverview Annotate-Api for the Original-Editor, nothing else is/needs to be called.
 * @name Api.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Api', [
    'TYPO3/CMS/Annotate/react',
    'jquery',
    'TYPO3/CMS/Annotate/List',
    'TYPO3/CMS/Annotate/Store',
    'TYPO3/CMS/Annotate/Editor',
    'TYPO3/CMS/Annotate/LoadingIndicator'
], function (
    React,
    $,
    List,
    Store,
    Editor,
    LoadingIndicator
) {
    /**
     * Api Constructor
     */
    var Api = function(){
    };
    Api.prototype = {
        // @type {boolean} were we actually created?
        created: false,
        // @type {Object}
        constructor: Api,
        // @type {Element}
        mountpoint: null,
        // @type {HTMLDocument}
        document: null,
        // @type {Object}
        editor: null,
        // @type {boolean}
        active: false,
        /**
         * Create the Concrete Annotate-Instance
         * @param {Element} mountpoint where will the List be mounted with React.
         * @param {HTMLDocument} document the document where we are editing annotations.
         * @param {!string} editorType specific editor type calling us, at the moment only htmlarea.
         * @param {!Object} editorInstance concrete instance of that editor.
         */
        create: function(mountpoint, document, editorType, editorInstance) {
            this.created = true;
            this.mountpoint = mountpoint;
            this.document = document;
            this.editor = new (Editor[editorType])(this, editorInstance);
            this.store = new Store(document, this.editor);
        },
        /**
         * Show annotation list
         */
        show: function() {
            this.active = true;
            $(this.document.body).addClass("htmlarea-show-annotations");
            React.render(React.createElement(List, {api: this, store: this.store}), this.mountpoint);
        },
        /**
         * Hide annotation list
         */
        hide: function() {
            this.active = false;
            $(this.document.body).removeClass("htmlarea-show-annotations");
            React.unmountComponentAtNode(this.mountpoint);
        },
        /**
         * Toogle annotation list visibility
         */
        toggle: function() {
            if (this.active)
                this.hide();
            else
                this.show();
        },
        /**
         * Automatically annotate the whole document
         */
        auto: function() {
            this.hide();
            React.render(React.createElement(LoadingIndicator, null), this.mountpoint);
            this.editor.autoAnnotate((function() {
                React.unmountComponentAtNode(this.mountpoint);
                this.show();
            }).bind(this));
        },
        // @type {React}
        react: React
    };
    return Api;
});