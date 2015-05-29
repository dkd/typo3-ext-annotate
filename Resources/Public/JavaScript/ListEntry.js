define('TYPO3/CMS/Annotate/ListEntry', [
    'TYPO3/CMS/Annotate/react',
], function (React) {
    return React.createClass({
        displayName: 'ListEntry',
        render: function() {
            return (
                    React.createElement("p", null, this.props.data.getAttribute("resource"))
            );
        }
    });
});
