/**
 * @fileOverview Annotate-Api for the Original-Editor, nothing else is/needs to be called.
 * @name Api.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/ListApi', [
    'TYPO3/CMS/Annotate/poly',
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/List',
    'TYPO3/CMS/Annotate/Store',
    'TYPO3/CMS/Annotate/Editor'
], function (
    Poly,
    React,
    List,
    Store,
    Editor
) {
    return {
        create: function(mountpoint, document, editorType, editorInstance) {
            var editor = new (Editor[editorType])(this, editorInstance);
            var store = new Store(document, editor);
            React.render(React.createElement(List, {editor: editor, store: store}), mountpoint);
        },
        destroy: function(mountpoint) {
            React.unmountComponentAtNode(mountpoint);
        }
    };
});
