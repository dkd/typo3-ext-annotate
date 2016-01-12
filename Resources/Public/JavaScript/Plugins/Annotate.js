/**
 * @fileOverview Annotate rtehtmlarea plugin
 * @name Annotate.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Plugins/Annotate', [
    'TYPO3/CMS/Rtehtmlarea/HTMLArea/Plugin/Plugin',
    'TYPO3/CMS/Rtehtmlarea/HTMLArea/Util/Util',
    'jquery',
    'TYPO3/CMS/Annotate/ListApi'
], function (
    Plugin,
    Util,
    $,
    ListApi
) {
    var Annotate = function(editor, pluginName){
        this.showing = false;
        this.editor = editor;
        this.constructor.super.call(this,  editor, pluginName);
    };
    Util.inherit(Annotate, Plugin);
    Util.apply(Annotate.prototype, {
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
                id: "showAnnotate",
                tooltip: "Annotate!",
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
        prepareMountpoint: function() {
            if (this.mountpointPrepared)
                return;

            var wrap = document.getElementById(this.editor.config.buttons.showAnnotate.wrap),
                formcontainer = wrap.parentElement,
                mountpoint = formcontainer.nextSibling;
            mountpoint.className = "htmlarea-bbar";
            this.mountpoint = mountpoint;
            this.mountpointPrepared = true;

            // resizable.style.height = (resizable.offsetHeight +  600) +  "px";
        },
        /**
         * After editor was loaded
         */
        onGenerate: function () {
            debugger;
            var headcss = this.editor.document.head;
            var css = this.editor.document.createElement('link');
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = this.editor.config.buttons.showAnnotate.documentcssPath;
            headcss.appendChild(css);
        },
        /**
         * Show/Hide annotation list
         */
        onAnnotate: function ()
        {
            this.prepareMountpoint();
            if (!this.showing)
            {
                this.showing = true;
                ListApi.create(this.mountpoint, this.editor.document, 'Htmlarea', this.editor);
                $(this.editor.document.body).addClass("htmlarea-show-annotations");
            }
            else
            {
                this.showing = false;
                ListApi.destroy(this.mountpoint);
                $(this.editor.document.body).removeClass("htmlarea-show-annotations");
            }
        },
        onUpdateToolbar: function (button, mode, selectionEmpty, ancestors)
        {
        }
    });
    return Annotate;
});

// name wrapper
define('TYPO3/CMS/Rtehtmlarea/Plugins/Annotate', [
    'TYPO3/CMS/Annotate/Plugins/Annotate'
],  function(Annotate) {
    return Annotate;
});
