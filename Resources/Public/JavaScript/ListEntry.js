/**
 * @fileOverview View for one annotation in its list
 * @name ListEntry.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/ListEntry', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe',
], function (
    React,
    Observe,
    ListEntryLine
) {
    return React.createClass({
        displayName: 'ListEntry',
        mixins: [Observe.Mixin('annotation')],
        /**
         * Expand this annotation
         */
        onExpand: function() {
            this.props.expand(this.state.annotation.get('aid'));
        },
        /**
         * Return a change handler for an attribute's value
         * @param {string} attribute
         * @returns {function}
         */
        onChange: function(attribute) {
            return (function(event) {
                this.state.annotation.set(attribute,event.target.value);
            }).bind(this);
        },
        /**
         * Delete this annotation
         */
        onDelete: function() {
            this.state.annotation.delete();
        },
        /**
         * Add hidden property
         */
        onAddPH: function() {
            this.props.editor.addPropertyHidden(this.state.annotation.span);
        },
        /**
         * Add property around selection
         */
        onAddPS: function() {
            this.props.editor.addPropertyAroundSelection();
        },
        /**
         * Rename Property
         */
        onRename: function(aid) {
            return (function(event) {
                this.state.annotation.properties.rename(aid, event.target.value);
            }).bind(this);
        },
        render: function() {
            var annotation = this.state.annotation,
                expanded = this.props.expanded,
                short = annotation.short();

            if (!expanded)
                return (React.createElement("div", null, " ", React.createElement("h3", {onClick: this.onExpand}, short)));
            else
                return (
                    React.createElement("div", null, React.createElement("h3", {onClick: this.onExpand}, short),
                      React.createElement("button", {onClick: this.onDelete, type:"button"}, "Delete"),
                      React.createElement("button", {onClick: this.onAddPS, type:"button", disabled: annotation.get("New Property") !== undefined}, "Add Property Around Selection"),
                      React.createElement("button", {onClick: this.onAddPH, type:"button", disabled: annotation.get("New Property") !== undefined}, "Add Hidden Property"),
                      React.createElement("br", null),
                      annotation.editableAttributes().map(function(attribute){
                          return React.createElement("span",{key: attribute}, attribute, ":",
                              React.createElement("input", {
                                  type: "text",
                                  name: attribute,
                                  value: annotation.get(attribute),
                                  onChange: this.onChange(attribute)
                              }),
                              React.createElement("br", null)
                             );
                      }, this),
                      annotation.properties.map(function(span){
                          var name = span.getAttribute('property'),
                              aid = span.getAttribute('aid');
                          return React.createElement("span", {key: aid},
                              React.createElement("input", {
                                  type: "text",
                                  value: name,
                                  onChange: this.onRename(span.getAttribute('aid'))
                              }),": ",
                              React.createElement("input", {
                                  type: "text",
                                  value: annotation.get(name),
                                  onChange: this.onChange(name)
                              }),
                              React.createElement("br", null)
                             );
                      }, this)
                     ));
        }
    });
});
