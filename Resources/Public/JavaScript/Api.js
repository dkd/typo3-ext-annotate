define('TYPO3/CMS/Annotate/Api', [
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
    var Api = function(){
    };
    Api.prototype = {
        created: false,
        constructor: Api,
        mountpoint: null,
        document: null,
        editor: null,
        active: false,
        create: function(mountpoint, document, editorType, editorInstance) {
            this.created = true;
            this.mountpoint = mountpoint;
            this.document = document;
            this.editor = new (Editor[editorType])(this, editorInstance);
            this.store = new Store(document, this.editor);
        },
        show: function(){
            this.active = true;
            $(this.document.body).addClass("htmlarea-show-annotations");
            React.render(React.createElement(List, {editor: this.editor, store: this.store}), this.mountpoint);
        },
        hide: function(){
            this.active = false;
            $(this.document.body).removeClass("htmlarea-show-annotations");
            React.unmountComponentAtNode(this.mountpoint);
        },
        toggle: function() {
            if (this.active)
                this.hide();
            else
                this.show();
        },
        react: React
    };
    return Api;
});