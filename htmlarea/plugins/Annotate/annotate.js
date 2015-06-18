/*
 This file is defining the HTMLArea-Plugin regarding ExtJS requirements - the editor is directly loading this.
 RequireJS does not really work inside here, as when this file is loaded, we need to be present after
 Which does not work well with an asynchronous load.
 Anyway, keeping ExtJS stuff explicitly here and everything else according to RequireJS allows for later
 cutting of ExtJS (7.X?)
 editorApi will be set to that stuff asynchronously.
 */

var Annotate = {};
var annotatePlugins = [];

HTMLArea.Annotate = Ext.extend(HTMLArea.Plugin, {
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
            id: "annotateAuto",
            tooltip: "annotate",
            action: "onAnnotate",
            textMode: true,
            dialog: true
        };
        this.registerButton(buttonConfiguration);
        buttonConfiguration = {
            id: "annotateHighlight",
            tooltip: "highlight",
            action: "onHighlightToggle",
            textMode: true,
            dialog: true
        };
        this.registerButton(buttonConfiguration);
        return true;
	  },
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
    onGenerate: function () {
		    var headcss = this.editor.document.head;
        var css = this.editor.document.createElement('link');
		    css.rel = 'stylesheet';
		    css.type = 'text/css';
		    css.href = this.editor.config.documentcssPath;
		    headcss.appendChild(css);
        annotatePlugins.push(this);
    },
	  onAnnotate: function (editor, id, target)
    {
        this.checkAnnotate();

        var input = editor.getInnerHTML(),
            was = Annotate.active,
            table = 0,
            uid = 0;

        if (was)
            Annotate.hide();

        //table = this.editorConfiguration.buttonsConfig.AnnotateButton.table,
        //uid = this.editorConfiguration.buttonsConfig.AnnotateButton.uid;

        TYPO3.Annotate.Server.annotateText(input,table,uid,function(result){
            editor.setHTML(result);
            if (was)
                Annotate.show();
        });

	      return false;
    },
	  onHighlightToggle: function ()
    {
        this.checkAnnotate();
        Annotate.toggle();
        return false;
	  },
	  onUpdateToolbar: function (button, mode, selectionEmpty, ancestors)
    {
	  }
});

require([
    'TYPO3/CMS/Annotate/Api',
], function(
    Api
){
    Annotate = new Api();
});
