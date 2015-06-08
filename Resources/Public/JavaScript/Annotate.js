define('TYPO3/CMS/Annotate/EditorApi', [
    'TYPO3/CMS/Annotate/react',
    'jquery',
    'TYPO3/CMS/Annotate/List',
    'TYPO3/CMS/Annotate/Store',
    'TYPO3/CMS/Annotate/Editor'
], function (
    React,
    $,
    List,
    Store,
    Editor
) {
    debugger;
    var Annotate = function(){
    };
    Annotate.prototype = {
        constructor: Annotate,
        mountpoint: null,
        document: null,
        editor: null,
        setEditor: function(editorType, editorInstance) {
            this.editor = new Editor[editorType](editorInstance);
        },
        show: function(mountpoint, document, htmlarea){
            this.mountpoint = mountpoint;
            this.document = document;
            this.store = new Store(document);
            React.render(React.createElement(List, {store: this.store}),this.mountpoint);
            $(this.document.body).addClass("htmlarea-show-annotations");
        },
        hide: function(){
            $(this.document.body).removeClass("htmlarea-show-annotations");
            React.unmountComponentAtNode(this.mountpoint);
            this.mountpoint = null;
            this.document = null;
            },
            react: React
    };
    return Annotate;
});