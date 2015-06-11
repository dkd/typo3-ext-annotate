define('TYPO3/CMS/Annotate/ListEntryLine', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe',
], function (
    React,
    Observe
) {
    return React.createClass({
        displayName: 'ListEntryLine',
            //mixins: [Observe.Mixin('annotation')],
        onChange: function(event) {
            this.props.annotation.span.setAttribute(this.props.attribute,event.target.value);
        },
        shouldComponentUpdate: function() {
            return true;
        },
        render: function() {
            return (
                React.createElement("span", null,
                  this.props.attribute,":",
                  React.createElement("input", {
                      type: "text",
                      name: this.props.attribute,
                      value: this.props.annotation[this.props.attribute],
                      onChange: this.onChange
                  }),
                  React.createElement("br", null)
                 )
            );
        }
    });
});
