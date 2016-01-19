/**
 * @fileOverview Remote functions for Annotate
 * @name Utility.js
 * @author Johannes Goslar
 */
define('TYPO3/CMS/Annotate/Remote', [
    'jquery'
], function (
    $
) {
    return {
        route: function(id)
        {
            if (TYPO3)
                return TYPO3.settings.ajaxUrls[id];
            else if (window && window.parent && window.parent.TYPO3)
                return window.parent.TYPO3.settings.ajxUrls[id];
            else
                return '';
        },
        annotate: function(text, cb)
        {
            $.post(this.route('annotate_annotate'), {text: text})
                .done(function(data) {
                    cb(null, data);
                }).
                fail(function(jqXHR, textStatus, errorThrown) {
                    cb(textStatus, null);
                });
        },
        index: function(tablename, id, content, cb)
        {
            $.post(this.route('annotate_index'), {tablename: tablename, id: id, content: content})
                .done(function(data) {
                    cb(null, data);
                }).
                fail(function(jqXHR, textStatus, errorThrown) {
                    cb(textStatus, null);
                });
        },
        query: function(verb, args, cb)
        {
            $.post(this.route('annotate_query'), {verb: verb, args: args})
                .done(function(data) {
                    cb(null, data);
                }).
                fail(function(jqXHR, textStatus, errorThrown) {
                    cb(textStatus, null);
                });
        },
        resolveId: function(id, cb)
        {
            $.post(this.route('annotate_resolveId'), {id: id})
                .done(function(data) {
                    cb(null, data);
                }).
                fail(function(jqXHR, textStatus, errorThrown) {
                    cb(textStatus, null);
                });
        },
        // generic ontoaut rpc
        ontoaut: function(name, args, cb)
        {
            $.ajax({
                type: "POST",
                url: this.route('annotate_ontoaut'),
                data: JSON.stringify({name: name, args: args}),
                contentType:"application/json; charset=utf-8",
                dataType: 'json'
            }).done(function(json) {
                if (!json.success)
                    cb(json.error, null);
                else
                    cb.call.apply(cb, [null].concat(json.data));
            })
                .fail(function(jqxhr, textStatus, error) {
                    cb(textStatus + error,  null);
                });
        },
        analyze: function(tablename, id, content, cb) {
        // FIXME: handle errors
        this.ontoaut('addJob', [{tablename: tablename, id: id, content:content}], cb);
    }
};
      });
