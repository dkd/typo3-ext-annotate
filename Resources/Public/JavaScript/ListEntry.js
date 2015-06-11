define('TYPO3/CMS/Annotate/ListEntry', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe',
    'TYPO3/CMS/Annotate/ListEntryLine',
], function (
    React,
    Observe,
    ListEntryLine
) {
    return React.createClass({
        displayName: 'ListEntry',
        mixins: [Observe.Mixin('annotation')],
        getInitialState: function() {
            return {
                expanded: false,
                editableAttributes: ["vocab","resource","typeof"]
            };
        },
        onExpand: function() {
            this.setState({expanded: !this.state.expanded});
        },
        onChange: function(attribute) {
            var context = this;
            return function(event) {
                context.state.annotation.span.setAttribute(attribute,event.target.value);
            };
        },
        onDelete: function() {
            this.state.annotation.delete();
        },
        render: function() {
            var annotation = this.props.annotation,
                expanded = this.state.expanded,
                short =  annotation.resource.split('/').pop();

            if (!expanded)
                return (React.createElement("div", null, " ", React.createElement("h3", {onClick: this.onExpand}, short)));
            else
                return (
                    React.createElement("div", null, React.createElement("h3", {onClick: this.onExpand}, short),
                      React.createElement("button", {onClick: this.onDelete, type:"button"}, "Delete"),
                      React.createElement("br", null),
                      this.state.editableAttributes.map(function(attribute){
                          return(React.createElement(ListEntryLine, {key: attribute, annotation: annotation, attribute: attribute}));
                      },this)
                     )
                );
        }
    });
});
