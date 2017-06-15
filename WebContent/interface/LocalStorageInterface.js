sap.ui.define([], function() {
    "use strict";

    return {
        _storageAvailable: false,

        init: function() {
            if(typeof Storage !== undefined) {
                console.log("LocalStorageInterface init OK");
                _storageAvailable = true;
            } else {
                console.error("Local Storage unavailable");
            }
        },

        saveData: function(key, data) {
            if(typeof data === "object") {
                try {
                    data = JSON.stringify(data);
                } catch(ex) {
                    console.error("Failed to save, JSON parsing error: " + ex);
                    return false;
                }
            }

            try{
                localStorage.setItem(key, data);
            }catch(ex){
                return false;
            }
            return true;
        },

        fetchData: function(key) {
            return localStorage.getItem(key);
        },

        clearData: function(key) {
            return localStorage.removeItem(key);
        }
    };

    // NOTE: Tried using jQuery.sap.storage API, it doesn't get loaded suring the startup phase and crashes everything.
    // jQuery.sap.storage is always null during startup (why? eh who knows).
    // May as well use standard JS & LocalStorage API instead because at least that works.
    // Why on earth would SAP add an extra API on top of an API that can't even handle its own standard lifecycle?
    // return {
    //     _storage: null,
    //
    //     init: function() {
    //         if(jQuery.sap.storage.isSupported()) {
    //             console.log("LocalStorageInterface init OK");
    //             this._storage = jQuery.sap.storage();
    //         } else {
    //             console.error("Local Storage unavailable");
    //         }
    //     },
    //
    //     saveData: function(key, data) {
    //         if(typeof data === "object") {
    //             try {
    //                 data = JSON.stringify(data);
    //             } catch(ex) {
    //                 console.error("Failed to save, JSON parsing error: " + ex);
    //                 return false;
    //             }
    //         }
    //
    //         return this._storage.put(key, data);
    //     },
    //
    //     fetchData: function(key) {
    //         return this._storage.get(key);
    //     },
    //
    //     clearData: function(key) {
    //         return this._storage.remove(key);
    //     }
    // };
});
