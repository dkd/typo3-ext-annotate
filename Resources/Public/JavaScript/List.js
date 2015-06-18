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
        getInitialState: function() {
            return {expanded: []};
        },
        onCreateAnnotation: function() {
            this.props.editor.createAnnotationAroundSelection.call(this.props.editor);
        },
        expand: function(aid) {
            var exp = this.state.expanded;
            if (exp.indexOf(aid) != - 1)
                exp.remove(aid);
            else
                exp.push(aid);
            this.setState({expanded: exp});
        },
        render: function() {
            return (
                React.createElement("div", {className: "annotate-list"},
                  React.createElement("button", {onClick: this.onCreateAnnotation, type:"button"}, "New Annotation Around Selection"),
                  React.createElement("h1", null, "Annotations"),
                  this.state.store.annotations.map(function(annotation, index) {
                      return React.createElement(ListEntry, {
                          key: annotation.get('aid'),
                          expand: this.expand,
                          expanded: (this.state.expanded.indexOf(annotation.get('aid')) != - 1),
                          annotation: annotation});
                  }, this)
                 )
            );
        }
    });
});
