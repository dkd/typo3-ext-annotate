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
                    <div id="annotate-list">
                    <h1>Annotations </h1>
                    {this.state.store.annotations.map(function(annotation) {
                        return <ListEntry key={annotation.id} annotation={annotation}/>;
                    })}
                </div>
            );
        }
    });
});
