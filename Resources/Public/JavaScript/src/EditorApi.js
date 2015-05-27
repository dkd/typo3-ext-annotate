define('TYPO3/CMS/Annotate/EditorApi', ['jquery','react/react'], function ($,react) {
    var api = {
        doStuff:function(){
            console.log('Yay! Stuff');
        },
        react: react
    };
    return api;
});
