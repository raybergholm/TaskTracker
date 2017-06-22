sap.ui.define([
    "sap/ui/base/Object",
    "../interface/DataPersistenceInterface"
], function(BaseSapObject, DataPersistenceInterface) {
    "use strict";

    // This class handles loading and saving of data locally (currently, that's mostly read/write operations to LocalStorage and import/export to file)
    return BaseSapObject.extend("com.tasky.manager.PersistenceManager", {
        _oDataPersistenceInterface: DataPersistenceInterface,
        _sStorageKey: "taskyData",

        initialize: function() {
            this._oDataPersistenceInterface.initialize();

            console.log("PersistenceManager init OK");
        },

        load: function() {
            return this._oDataPersistenceInterface.fetchData(this._sStorageKey);
        },

        clear: function() {
            return this._oDataPersistenceInterface.clearData(this._sStorageKey);
        },

        save: function(data) {
            return this._oDataPersistenceInterface.saveData(this._sStorageKey, data);
        }
    });
});
