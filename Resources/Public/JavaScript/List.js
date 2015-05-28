define('TYPO3/CMS/Annotate/List', [
    'TYPO3/CMS/Annotate/react'
], function (React) {
    var MyComponent = React.createClass({displayName: "MyComponent",
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
                    React.createElement("div", {id: "annotate-list"}, 
                    React.createElement("h1", null, "Annotations "), 
                    this.state.annotations.map(function(result) {
                        return React.createElement("p", null, result.getAttribute("resource"));
                    })
                )
            );
        }
    });
    return MyComponent;
});
        
