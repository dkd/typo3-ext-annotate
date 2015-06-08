define('TYPO3/CMS/Annotate/EditorFunctions', [
], function (

) {
    var Abs = function(){
    };
    Abs.prototype = {
        constructor: Abs
    };

    var Htmlarea = function(htmlarea) {
        this.htmlarea = htmlarea;
    };
    Htmlarea.prototype = Object.create(Abs.prototype, {
        constructor: Htmlarea,
        wrapSelection: function() {
            
        }
    });

    return {
        Htmlarea: Htmlarea
    };
});
