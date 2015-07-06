define('TYPO3/CMS/Annotate/Properties', [
], function () {
    /**
     * Property Container
     * @param {Observe} observe
     */
    function Properties(observe, editor) {
        // @type {Observe}
        this.observe = observe;
        // @type {Element[]}
        this.raw = [];
        // @type {Editor}
        this.editor = editor;

        this.map = Array.prototype.map.bind(this.raw);
    }

    Properties.prototype.constructor =  Properties;

    /**
     * Add a property span
     * @param {Element} span
     */
    Properties.prototype.add = function (span, annotation) {
        span.annotation = annotation;
        this.raw.push(span);
        this.observe.trigger();
    };

    /**
     * Remove a property span
     * @param {Element} span
     */
    Properties.prototype.remove = function (span) {
        var index = this.raw.indexOf(span);
        if (index != - 1)
        {
            this.raw.splice(index, 1);
            this.observe.trigger();
        }
    };

    /**
     * Remove all properties
     */
    Properties.prototype.unwrapAll = function () {
        debugger;
        this.raw.forEach(this.unwrap, this);
    };

    /**
     * Remove a property by name
     * @param {string} name
     */
    Properties.prototype.unwrap = function (nameOrAidSpan) {
        var span = (typeof nameOrAidSpan == Element) ? nameOrAidSpan : this.findByName(nameOrAidSpan) || this.findByAid(nameOrAidSpan);
        if (!span)
            return;
        if (span.hasAttribute('hidden'))
            span.parentNode.removeChild(span);
        else
            this.editor.unwrapElement(span);
    };

    /**
     * Find a property span
     * @param {string} name
     */
    Properties.prototype.findByName = function (name) {
        // polyfilled es6 find
        return this.raw.find(function(prop) {
            return prop.getAttribute('property') == name? prop : undefined;
        });
    };

    /**
     * Find a property span
     * @param {string} aid
     */
    Properties.prototype.findByAid = function (aid) {
        // polyfilled es6 find
        return this.raw.find(function(prop) {
            return prop.getAttribute('aid') == aid ? prop : undefined;
        });
    };

    /**
     * Return all property names
     * @returns {string[]}
     */
    Properties.prototype.names = function () {
        return this.raw.map(function(prop) {
            return prop.getAttribute('property');
        });};

    /**
     * Rename property, keep value
     * @param {string} aid
     * @param {string} nw
     */
    Properties.prototype.rename = function(aid, nw) {
        this.findByAid(aid).setAttribute('property', nw);
        this.observe.trigger();
    };

    return Properties;
});
