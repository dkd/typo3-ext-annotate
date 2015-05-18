console.log("loaded");
HTMLArea.AnnotateButton = Ext.extend(HTMLArea.Plugin, {
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
            id: "annotateButton",
            tooltip: "annotate",
            action: "onAnnotate",
            textMode: true,
            dialog: true
        };
        this.registerButton(buttonConfiguration);
        buttonConfiguration = {
            id: "highlightButton",
            tooltip: "highlight",
            action: "onHighlightToggle",
            textMode: true,
            dialog: true
        };
        this.registerButton(buttonConfiguration);
        return true;
	},
	onAnnotate: function (editor, id, target)
    {
        var input = editor.getInnerHTML(),
            table = this.editorConfiguration.buttonsConfig.AnnotateButton.table,
            uid = this.editorConfiguration.buttonsConfig.AnnotateButton.uid;
        
        TYPO3.GATE.Server.someFunction(input,table,uid,function(result){
            editor.setHTML(result);
        });
	    return false;
    },
	onHighlightToggle: function (editor, id, target)
    {
		var body = this.editor.document.body;
		if (!HTMLArea.DOM.hasClass(body, 'htmlarea-show-annotations'))
            HTMLArea.DOM.addClass(body,'htmlarea-show-annotations');
        else
		    HTMLArea.DOM.removeClass(body,'htmlarea-show-annotations');
	    return false;
	},
	onUpdateToolbar: function (button, mode, selectionEmpty, ancestors)
    {
	}
});
