define('TYPO3/CMS/Annotate/ListEntry', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe',
], function (
    React,
    Observe
) {
    return React.createClass({
        displayName: 'ListEntry',
        getInitialState: function() {
            return {expanded: false};
        },
        onExpand: function() {
            this.setState({expanded: !this.state.expanded});
        },
        onChange: function(attribute) {
            return function(event) {
                this.props.annotation.setAttribute(attribute,event.target.value);
            };
        },
        onDelete: function() {
            console.log('delete');
            this.props.annotation.delete();
        },
        render: function() {
            var short =  this.props.annotation.resource.split('/').pop();
            if (!this.state.expanded)
                return (React.createElement("div", null, " ", React.createElement("h3", {onClick: this.onExpand}, short)));
            else
                return (React.createElement("div", null, " ", React.createElement("h3", {onClick: this.onExpand}, short), 
                        React.createElement("button", {onClick: this.onDelete}, "Delete"), 
                        React.createElement("form", {action: ""}, 
                        "Vocab: ", React.createElement("input", {type: "text", name: "vocab", value: this.props.annotation.vocab, onChange: this.onChange('vocab')}), React.createElement("br", null), 
                        "Resource: ", React.createElement("input", {type: "text", name: "resource", value: this.props.annotation.resource, onChange: this.onChange('resource')}), React.createElement("br", null), 
                        "Typeof: ", React.createElement("input", {type: "text", name: "typeof", value: this.props.annotation.typeof, onChange: this.onChange('typeof')}), React.createElement("br", null)
                        )
                        )
                       );
        }
    });
});
