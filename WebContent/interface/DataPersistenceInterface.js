// this gets its own class so it can be abstracted into its own layer.
// So if we swap how the data gets stored, we just swap out the endpoints without affecting the rest of the app.
// Just assert that anything going into this.dataStorage implements saveData() and fetchData() and everything will work fine.

sap.ui.define([
    "./LocalStorageInterface"
], function(DataStorageInterface) {
    "use strict";

    return {
        _oDataStorage: DataStorageInterface,

        initialize: function(){
            this._oDataStorage.initialize();
        },

        fetchData: function(key) {
            return this._oDataStorage.fetchData(key);
        },

        clearData: function(key) {
            return this._oDataStorage.clearData(key);
        },

        saveData: function(key, data) {
            return this._oDataStorage.saveData(key, data);
        }
    };
});
