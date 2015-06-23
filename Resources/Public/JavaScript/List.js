/**
 * @fileOverview Annotation List View
 * @name List.js
 * @author Johannes Goslar
 */
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
            return {expanded: null};
        },
        /**
         * Create new annotation
         */
        onCreateAnnotation: function() {
            this.props.api.editor.createAnnotationAroundSelection.call(this.props.api.editor);
        },
        /**
         * Automatically annotate the whole document
         */
        onAuto: function() {
            this.props.api.auto.call(this.props.api);
        },
        /**
         * Expand one annotation
         * @param {string} aid
         */
        expand: function(aid) {
            this.setState({expanded: aid});
        },
        render: function() {
            return (
                React.createElement("div", {className: "annotate-list"},
                  React.createElement("button", {onClick: this.onAuto, type:"button"}, "Annotate!"),
                  React.createElement("button", {onClick: this.onCreateAnnotation, type:"button"}, "New Annotation Around Selection"),
                  React.createElement("h1", null, "Annotations"),
                  this.state.store.annotations.map(function(annotation, index) {
                      return React.createElement(ListEntry, {
                          key: annotation.get('aid'),
                          editor: this.props.api.editor,
                          expand: this.expand,
                          expanded: this.state.expanded == annotation.get('aid'),
                          annotation: annotation});
                  }, this)
                 )
            );
        }
    });
});
