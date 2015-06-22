/**
 * @fileOverview  This file is defining the HTMLArea-Plugin regarding ExtJS requirements - the editor is directly loading this.  RequireJS does not really work inside here, as when this file is loaded, we need to be present after. Which does not work well with an asynchronous load. Anyway, keeping ExtJS stuff explicitly here and everything else according to RequireJS allows for later cutting of ExtJS (7.X?)  editorApi will be set to that stuff asynchronously.
 * @name annotate.js
 * @author Johannes Goslar
 */

var Annotate = {};
var annotatePlugins = [];

HTMLArea.Annotate = Ext.extend(HTMLArea.Plugin, {
    /**
     * Setup Plugin Button
     * @param {Object} editor
     * @returns {boolean}
     */
	  configurePlugin: function (editor)
    {
		    var pluginInformation = {
			      version		: '0.1',
			      developer	: 'Johannes Goslar',
			      developerUrl	: 'http://www.dkd.de/',
			      copyrightOwner	: 'dkd Internet Service GmbH',
			      sponsor		: 'dkd Internet Service GmbH',
			      sponsorUrl	: 'http://www.dkd.de/',
			      license		: 'GPL'
		    };
		    this.registerPluginInformation(pluginInformation);
        var buttonConfiguration = {
            id: "annotate",
            tooltip: "highlight",
            action: "onAnnotate",
            textMode: true,
            dialog: true
        };
        this.registerButton(buttonConfiguration);
        return true;
	  },
    /**
     * Make sure we actually create the Annotate instance and its mountpoints
     */
    checkAnnotate: function() {
        if (!Annotate.created)
        {
            var wrap = document.getElementById("editorWrap" +this.editor.editorId),
                editortr = wrap.parentElement.parentElement,
                before = wrap.parentElement.nextSibling,
                mountpoint = document.createElement("td");
            editortr.insertBefore(mountpoint,before);

            Annotate.create(mountpoint, this.editor.document, 'Htmlarea', this.editor);
        }
    },
    /**
     * After editor was loaded
     */
    onGenerate: function () {
		    var headcss = this.editor.document.head;
        var css = this.editor.document.createElement('link');
		    css.rel = 'stylesheet';
		    css.type = 'text/css';
		    css.href = this.editor.config.documentcssPath;
		    headcss.appendChild(css);
        annotatePlugins.push(this);
    },
    /**
     * Show/Hide annotation list
     * @returns {boolean}
     */
    onAnnotate: function ()
    {
        this.checkAnnotate();
        Annotate.toggle();
        return false;
	  },
	  onUpdateToolbar: function (button, mode, selectionEmpty, ancestors)
    {
	  }
});

/**
 * Async load for the annotate js stuff
 */
require([
    'TYPO3/CMS/Annotate/Api',
], function(
    Api
){
    Annotate = new Api();
});
