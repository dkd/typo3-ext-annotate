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
            this.setState({expanded: this.state.expanded != aid ? aid : null});
        },
        render: function() {
            return (
                React.createElement("div", {className: "annotate"},
                  React.createElement("div", {className: "wrapper"},
                    React.createElement("div", {className: "moduleTitle"},
                      React.createElement("h1", null, "Annotations")
                     ),
                    React.createElement("section", null,
                      React.createElement("button", {onClick: this.onAuto, type:"button", className: "all"}, "Annotate!"),
                      React.createElement("button", {onClick: this.onCreateAnnotation, type:"button", className: "new"}, "New Annotation Around Selection")
                     ),
                    React.createElement("div", {className: "entities"},
                      this.state.store.annotations.map(function(annotation, index) {
                          return React.createElement(ListEntry, {
                              key: annotation.get('aid'),
                              editor: this.props.api.editor,
                              expand: this.expand,
                              expanded: this.state.expanded == annotation.get('aid'),
                              annotation: annotation});
                      }, this)
                     )
                   )
                 )
            );
        }
    });
});
