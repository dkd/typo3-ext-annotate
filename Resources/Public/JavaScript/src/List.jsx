define('TYPO3/CMS/Annotate/List', [
    'TYPO3/CMS/Annotate/react'
], function (React) {
    var MyComponent = React.createClass({
        calculateState: function(){
            var rawAnnotations = this.props.body.querySelectorAll("[vocab]");
            var data = [];
            for (var i = 0; i < rawAnnotations.length; ++i) {
                data.push(rawAnnotations[i]);
            }
            return {
                annotations: data
            };
        },
        getInitialState: function() {
            return this.calculateState();
        },
        render: function() {
            return (
                    <div id="annotate-list">
                    <h1>Annotations </h1>
                    {this.state.annotations.map(function(result) {
                        return <p>{result.getAttribute("resource")}</p>;
                    })}
                </div>
            );
        }
    });
    return MyComponent;
});
        
