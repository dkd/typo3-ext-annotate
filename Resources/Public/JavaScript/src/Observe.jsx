define('TYPO3/CMS/Annotate/Observe',[
], function(
){
    function Observe() {
        this.observers = [];
    };
    Observe.prototype = {
        constructor: Observe,
        add: function(cb) {
            this.observers.push(cb);
        },
        remove: function(cb) {
            this.observers.remove(cb);
        },
        trigger: function() {
            this.observers.forEach(function (cb) {cb();});
        }
    };

    Observe.Mixin =  function(key) {
        return {
            componentDidMount: function() {
                this.props[key].observe.add(this.observeChanged);
            },
            componentDidUnmount: function() {
                this.props[key].observe.remove(this.observeChanged);
            },
            observeChanged: function() {
                var newState =  {};
                newState[key] =  this.props[key];
                this.setState(newState);
            },
            getInitialState: function() {
                var newState =  {};
                newState[key] =  this.props[key];
                return newState;
            }
        };
    };

    return Observe;
});