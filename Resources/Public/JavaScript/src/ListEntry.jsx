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
                return (<div> <h3 onClick={this.onExpand}>{short}</h3></div>);
            else
                return (<div> <h3 onClick={this.onExpand}>{short}</h3>
                        <button onClick={this.onDelete}>Delete</button>
                        <form action="">
                        Vocab: <input type="text" name="vocab" value={this.props.annotation.vocab} onChange={this.onChange('vocab')} /><br/>
                        Resource: <input type="text" name="resource" value={this.props.annotation.resource} onChange={this.onChange('resource')} /><br/>
                        Typeof: <input type="text" name="typeof" value={this.props.annotation.typeof} onChange={this.onChange('typeof')} /><br/>
                        </form>
                        </div>
                       );
        }
    });
});
