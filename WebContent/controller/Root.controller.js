sap.ui.define([
    "./BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("com.tasky.controller.Root", {
        _sStackTraceDisplayElementId: "stackTraceDisplay",
        _uiGlobalErrorDialog: null,

        onInit: function() {
            BaseController.prototype.onInit.apply(this, arguments);
        },

        _getStackTraceDisplayElement: function(elements){
            var i;
            var stackTraceDisplay = null;
            for(i = 0; i < elements.length; i++){
                if(elements[i].getId() === this._sStackTraceDisplayElementId){
                    stackTraceDisplay = elements[i];
                    break;
                }
            }

            return stackTraceDisplay;
        },

        showGlobalErrorDialog: function(oEvent){
            if(!this._uiGlobalErrorDialog){
                this._uiGlobalErrorDialog = sap.ui.xmlfragment("com.tasky.dialog.GlobalErrorDialog", this);
                this.getView().addDependent(this._uiGlobalErrorDialog);
            }

            var stackTraceDisplay = this._getStackTraceDisplayElement(this._uiGlobalErrorDialog.getContent());
            if(stackTraceDisplay){
                stackTraceDisplay.setValue(oEvent.error.stack);
            }

            this._uiGlobalErrorDialog.open();
        },

        onPressButtonCopyStackTrace: function(oEvent){
            if(!this._uiGlobalErrorDialog){
                return;
            }

            var stackTraceDisplay = this._getStackTraceDisplayElement(this._uiGlobalErrorDialog.getContent());
            if(stackTraceDisplay){
                stackTraceDisplay.focus();
                stackTraceDisplay.selectText(0, textArea.getValue().length - 1);
                document.execCommand("copy");
            }
        },

        onPressButtonCloseErrorDialog: function(oEvent){
            if(this._uiGlobalErrorDialog){
                this._uiGlobalErrorDialog.close();
            }
        }
    });
});
