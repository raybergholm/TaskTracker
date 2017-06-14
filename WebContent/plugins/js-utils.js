var jsUtils = new JsUtils();;

function JsUtils(){
    "use strict";

    this.Object = {
        clone: function(source){
            // NOTE: Object.assign() copies properties which could be accessed using .hasOwnProperty.
            // Variables and functions will be separate, but if a property is a reference,
            // the reference gets copied: this means that this clone behaviour is only one level deep,
            // anything deeper is still a reference to the original object. Also, since arrays are objects it will also be a reference here

            var destination;
            if(source instanceof Array){
                destination = Object.assign([], source);
            }
            else if(typeof source === "object"){
                destination = Object.assign({}, source);
            }else{
                console.error("Source for clone operation was not an object or array");
            }

            return destination;
        },

        deepClone: function(source){
            var destination = {};

            if(typeof source !== "object"){
                console.error("Source for deep clone operation was not an object");
            }

            for(var prop in source){
                if(source.hasOwnProperty(prop)){
                    if(prop instanceof Array){
                        // FIXME: arrays are objects too, but this isn't being handled
                    }else if(typeof prop === "object"){
                        destination[prop] = this.deepClone(source[prop]);
                    }else{
                        destination[prop] = source[prop];
                    }
                }
            }

            return destination;
        }
    };

    this.String = {
        format: function(str, replacements){
            return str.replace(/\{\d+\}/g, function(match){
                return replacements[match.substring(1, match.length -1)] || match;
            });
        }
    };
}
