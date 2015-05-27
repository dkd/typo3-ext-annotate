define('TYPO3/CMS/Annotate/EditorApi', ['jquery','TYPO3/CMS/Annotate/react'], function ($,react) {
    var api = {
        doStuff:function(){
            console.log('Yay! Stuff');
        },
        react: react
    };
    return api;
});
