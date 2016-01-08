
/**
 * @fileOverview View for one annotation in its list
 * @name ListEntry.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/ListEntry', [
    'TYPO3/CMS/Annotate/react',
    'TYPO3/CMS/Annotate/Observe',
], function (
    React,
    Observe,
    ListEntryLine
) {
    return React.createClass({
        displayName: 'ListEntry',
        mixins: [Observe.Mixin('annotation')],
        /**
         * Expand this annotation
         */
        onExpand: function() {
            if (this.toBeDeleted)
                return;
            this.props.expand(this.state.annotation.get('aid'));
        },
        /**
         * Return a change handler for an attribute's value
         * @param {string} attribute
         * @returns {function}
         */
        onChange: function(attribute) {
            return (function(event) {
                this.state.annotation.set(attribute,event.target.value);
            }).bind(this);
        },
        /**
         * Delete this annotation
         */
        onDelete: function() {
            this.toBeDeleted =  true;
            this.state.annotation.delete();
        },
        /**
         * Add hidden property
         */
        onPropertyHidden: function() {
            this.props.editor.addPropertyHidden(this.state.annotation.span);
        },
        /**
         * Add property around selection
         */
        onPropertySurround: function() {
            this.props.editor.addPropertyAroundSelection();
        },
        /**
         * Rename Property
         */
        onPropertyRename: function(aid) {
            return (function(event) {
                this.state.annotation.properties.rename(aid, event.target.value);
            }).bind(this);
        },
        /**
         * Delete Property
         */
        onPropertyDelete: function(aid) {
            return (function(event) {
                this.state.annotation.properties.unwrap(aid);
            }).bind(this);
        },
        titles: function(key) {
            if (key == "vocab")
                return "The vocabulary field links to an ontology schema. This defines the hierarchical model the information is stored in.";
            else if (key == "resource")
                return "The resource field links to the actual instance data / entity on a remote entity host.";
            else if (key == "typeof")
                return "The typeof field specifies the ressource type.";
            else
                return "";
        },
        render: function() {
            this.state.annotation.doBlink(this.props.expanded);
            var annotation = this.state.annotation,
                self = this,
                expanded = this.props.expanded,
                short = annotation.short(),
                header = React.createElement('div', {className: 'moduleTitle'},
                                             React.createElement('h3', {onClick: this.onExpand},
                                                                 React.createElement('button', {type:'button', className: 'icon iconExpand'}),
                                                                 short,
                                                                 React.createElement('button', {onClick: this.onDelete, type:'button', className: 'icon iconDelete'})
                                                                ));

            if (!expanded)
                return header;

            return React.createElement('div', {className: 'expanded'},
                                       header,
                                       React.createElement('section', null,
                                                           annotation.editableAttributes().map(function(attribute){
                                                               return React.createElement('span',{key: attribute, title: self.titles(attribute) }, attribute, ':',
                                                                                          React.createElement('input', {
                                                                                              type: 'text',
                                                                                              name: attribute,
                                                                                              value: annotation.get(attribute),
                                                                                              onChange: this.onChange(attribute)
                                                                                          })
                                                                                         );
                                                           }, this),
                                                           annotation.properties.map(function(span){
                                                               var name = span.getAttribute('property'),
                                                                   aid = span.aid;
                                                               return React.createElement(
                                                                   'div', {key: aid, className: 'property'},
                                                                   React.createElement('input', {
                                                                       key: aid + 'k', className: 'key',
                                                                       type: 'text',
                                                                       value: name,
                                                                       onChange: this.onPropertyRename(aid)
                                                                   }),
                                                                   React.createElement('input', {className: 'separator'}),
                                                                   React.createElement('input', {
                                                                       key: aid + 'p',
                                                                       className: 'value',
                                                                       type: 'text',
                                                                       value: annotation.get(name),
                                                                       onChange: this.onChange(name)
                                                                   }),
                                                                   React.createElement('input', {
                                                                       type: 'button',
                                                                       className: 'icon iconDeleteDark',
                                                                       onClick: this.onPropertyDelete(aid)
                                                                   })
                                                               );
                                                           }, this),
                                                           React.createElement('button', {onClick: this.onPropertySurround, type:'button', disabled: annotation.get('New Property') !== undefined}, 'Add Property Around Selection'),
                                                           React.createElement('button', {onClick: this.onPropertyHidden, type:'button', disabled: annotation.get('New Property') !== undefined}, 'Add Hidden Property')
                                                          )
                                      );
        }
    });
});
