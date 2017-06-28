var jsUtils = new JsUtils();;

function JsUtils() {
    "use strict";

    this.Object = {
        clone: function(source) {
            // NOTE: Object.assign() copies properties which could be accessed using .hasOwnProperty.
            // Variables and functions will be separate, but if a property is a reference,
            // the reference gets copied: this means that this clone behaviour is only one level deep,
            // anything deeper is still a reference to the original object. Also, since arrays are objects it will also be a reference here

            var destination;
            if(source instanceof Array) {
                destination = Object.assign([], source);
            } else if(typeof source === "object") {
                destination = Object.assign({}, source);
            } else {
                console.error("Source for clone operation was not an object or array");
                destination = null;
            }

            return destination;
        },

        deepClone: function(source) {
            var destination = {}; // FIXME: actually the fact arrays need special handling is just a giant PitA. Maybe split it to Array.deepClone?

            if(typeof source !== "object") {
                console.error("Source for deep clone operation was not an object");
                return null;
            }

            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    if(prop instanceof Array) {
                        // FIXME: arrays are objects too, but this isn't being handled
                    } else if(typeof prop === "object") {
                        destination[prop] = this.deepClone(source[prop]);
                    } else {
                        destination[prop] = source[prop];
                    }
                }
            }

            return destination;
        }
    };

    this.String = {
        // Functions mostly like String.Format() in other languages.
        //
        // Normal use cases:
        //  format("{0} {1}", ["Hello", "world"]) -> "Hello world"
        //  format("hi {0}", ["Bob"]) -> "hi Bob"
        //
        // Weirder use cases:
        //  format("{0} {1}", {0: "Hello", "1": "world"}) -> "Hello world"      - works because of how JS treats arrays, maps and objects
        //  format("{0}{1}{4}{5}", "hello") -> "heo{5}"                         - I suppose it's legal to pass in a string and match chars by index. Maybe a bit weird though.
        //
        // Use cases with mismatches:
        //  format("{0} {1}", ["gibberish"]) -> "gibberish {1}"     - {0} ok but {1} not matched
        //  format("{2}", ["Hello", "world"]) -> "{2}"              - array doesn't contain that many elements
        //  format("{0}", []) -> "{0}"                              - empty array, nothing will get matched
        //  format("Hi there", ["Hello", "world"]) -> "Hi there"    - no match tokens: array doesn't matter then. String stays the same
        //
        // Results when you deliberately pass in wrong formats:
        //  format("{0} {1}", {}) -> "{0} {1}"                              - empty object
        //  format("{0} {1}", 123) -> "{0} {1}"                             - integer
        //  format("{0}", [123]) -> "123"                                   - array with integer
        //  format("{0}", [{}]) -> "[object Object]"                        - array with object object.toString() called
        //  format({replace: function(){return "hi"}}, ["hello"]) -> "hi"   - ... ok, that's just evil. Don't do this
        //
        // Stuff that throws an error:
        //  format()                        - undefined string (and array)
        //  format("{0}")                   - undefined array
        //  format({}, ["hello"])           - object isn't a string (no replace function)
        //  format([], ["hello"]])          - array isn't a string (no replace function)
        //  format(123, ["hello"]])         - integer isn't a string (no replace function)
        format: function(str, replacements) {
            return str.replace(/\{\d+\}/g, function(match) {
                return replacements[match.substring(1, match.length - 1)] || match;
            });
        }
    };
}
