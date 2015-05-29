define('TYPO3/CMS/Annotate/List', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/ListEntry'
], function (React, ListEntry) {
    return React.createClass({
        displayName: 'List',
        nextId: function() {
            var id =(this.nextIdCounter === undefined) ? 1 : this.nextIdCounter;
            this.nextIdCounter = id +1;
            return id;
        },        
        calculateState: function(){
            var rawAnnotations = this.props.body.querySelectorAll("[vocab]");
            var data = [];
            for (var i = 0; i < rawAnnotations.length; ++i) {
                var span = rawAnnotations[i];
                if (span.annotationId === undefined)
                    span.annotationId = this.nextId();
                data.push(span);
            }
            return {
                annotations: data
            };
        },
        getInitialState: function() {
            debugger;
            return this.calculateState();
        },
        render: function() {
            return (
                    <div id="annotate-list">
                    <h1>Annotations </h1>
                    {this.state.annotations.map(function(result) {
                        return <ListEntry key={result.annotationId} data={result}/>;
                    })}
                </div>
            );
        }
    });
});
        