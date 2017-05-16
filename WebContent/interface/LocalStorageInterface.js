sap.ui.define([
    "jQuery/sap/storage"
], function(Storage) {
	"use strict";

    var localStorageInterface = {
        init: function() {
            if(Storage.isSupported()) {
                console.log("LocalStorageInterface init OK");
            } else {
                console.error("Local Storage unavailable");
            }
        },

        saveData: function(key, data) {
            if(typeof data === "object") {
                data = JSON.stringify(data);
            }

            return Storage.put(key, data);
        },

        fetchData: function(key) {
            return this.dataStorage.get(_localStorageKey);
        }
    };

    return localStorageInterface;
});
