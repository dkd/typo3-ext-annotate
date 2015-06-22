/**
 * @fileOverview Simple React Mixin for automatically setting an observable property to state
 * @name Observe.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Observe',[
], function(
){
    /**
     * Constructor of a most simple observer implementation
     */
    function Observe() {
        this.observers = [];
    };
    Observe.prototype = {
        constructor: Observe,
        /**
         * Add a observer callback
         * @param {function} cb
         */
        add: function(cb) {
            this.observers.push(cb);
        },
        /**
         * Remove an observer callback
         * @param {function} cb
         */
        remove: function(cb) {
            this.observers.remove(cb);
        },
        /**
         * Trigger all observers
         */
        trigger: function() {
            this.observers.forEach(function (cb) {cb();});
        }
    };

    /**
     * Return a react mixin for auto-observing a property of the given key
     * @param {string} key
     * @returns {Object}
     */
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