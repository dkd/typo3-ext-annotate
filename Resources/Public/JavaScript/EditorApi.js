define('TYPO3/CMS/Annotate/EditorApi', [
    'TYPO3/CMS/Annotate/react',
    'jquery',
    'TYPO3/CMS/Annotate/List',
    'TYPO3/CMS/Annotate/Store'
], function (
    React,
    $,
    List,
    Store
) {
    var api = {
        mountpoint : null,
        document: null,
        show: function(mountpoint, document){
            this.mountpoint = mountpoint;
            this.document = document;
            this. store = new Store(document);
            React.render(React.createElement(List, {body: document.body}),this.mountpoint);
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
    return api;
});
