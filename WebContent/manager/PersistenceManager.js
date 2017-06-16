sap.ui.define([
    "sap/ui/base/Object",
    "./interface/DataPersistenceInterface"
], function(BaseSapObject, Templater, DataPersistenceInterface) {
	"use strict";

    // This class handles loading and saving of data locally (currently, that's mostly read/write operations to LocalStorage and import/export to file)
    return BaseSapObject.extend("com.tasky.manager.DataManager", {

    });
});
