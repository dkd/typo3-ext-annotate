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
        show: function() {
            this.active = true;
            $(this.document.body).addClass("htmlarea-show-annotations");
            React.render(React.createElement(List, {api: this, store: this.store}), this.mountpoint);
        },
        hide: function() {
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
        auto: function() {
            var input = this.editor.getContent(),
                table = 0, //this.editorConfiguration.buttonsConfig.AnnotateButton.table,
                uid = 0;  //uid = this.editorConfiguration.buttonsConfig.AnnotateButton.uid;

            this.hide();
            React.render(React.createElement(LoadingIndicator, null), this.mountpoint);


            TYPO3.Annotate.Server.annotateText(input, table, uid, (function(result){
                this.editor.setContent(result);
                React.unmountComponentAtNode(this.mountpoint);
                this.show();
            }).bind(this));
        },
        react: React
    };
    return Api;
});