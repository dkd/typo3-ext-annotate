define('TYPO3/CMS/Annotate/List', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/ListEntry',
    'TYPO3/CMS/Annotate/Observe',
], function (
    React,
    ListEntry,
    Observe
) {
    return React.createClass({
        displayName: 'List',
        mixins: [Observe.Mixin('store')],
        render: function() {
            return (
                    React.createElement("div", {id: "annotate-list"}, 
                    React.createElement("h1", null, "Annotations "), 
                    this.state.store.annotations.map(function(annotation) {
                        return React.createElement(ListEntry, {key: annotation.id, annotation: annotation});
                    })
                )
            );
        }
    });
});
