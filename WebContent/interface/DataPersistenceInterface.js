// this gets its own class so it can be abstracted into its own layer.
// So if we swap how the data gets stored, we just swap out the endpoints without affecting the rest of the app.
// Just assert that anything going into this.dataStorage implements saveData() and fetchData() and everything will work fine.

sap.ui.define([
    "sap/ui/base/Object",
    "./LocalStorageInterface"
], function(BaseSapObject, DataStorageInterface) {
	"use strict";

    var objInstance = BaseSapObject.extend("com.tasky.interface.DataPersistenceInterface", {
        _dataStorage: new DataStorageInterface(),

        saveData: function(key, data) {
            return this._dataStorage.saveData(key, data);
        },

        fetchData: function(key) {
            return this._dataStorage.fetchData(key);
        }
    });

    return objInstance;
});
