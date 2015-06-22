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
            var context = this;
            return function(event) {
                context.state.annotation.set(attribute,event.target.value);
            };
        },
        /**
         * Delete this annotation
         */
        onDelete: function() {
            this.state.annotation.delete();
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
                      React.createElement("br", null),
                      annotation.editableAttributes.map(function(attribute){
                          return React.createElement("span",{key: attribute}, attribute, ":",
                              React.createElement("input", {
                                  type: "text",
                                  name: attribute,
                                  value: annotation.get(attribute),
                                  onChange: this.onChange(attribute)
                              }),
                              React.createElement("br", null)
                             );
                      }, this)
                     ));
        }
    });
});
