sap.ui.define([], function() {
	"use strict";

    return {
        _storage: null,

        init: function() {
            if(jQuery.sap.storage.isSupported()) {
                console.log("LocalStorageInterface init OK");
                this._storage = jQuery.sap.storage();
            }else {
                console.error("Local Storage unavailable");
            }
        },

        saveData: function(key, data) {
            if(typeof data === "object") {
                data = JSON.stringify(data);
            }

            return this._storage.put(key, data);
        },

        fetchData: function(key) {
            return this._storage.get(_localStorageKey);
        }
    };
});
