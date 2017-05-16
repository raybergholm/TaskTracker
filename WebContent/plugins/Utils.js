var Utils;

(function(){
    "use strict";

    Utils = {};

    Utils.String = {
        format: function(str, replacements){
            return str.replace(/\{\d+\}/g, function(match){
                return replacements[match.substring(1, match.length -1)] || match;
            });
        }
    };
})();
