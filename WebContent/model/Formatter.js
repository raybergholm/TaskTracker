sap.ui.define([], function() {
    "use strict";
	return {
        userFriendlyTimestamp: function(inputTimestamp){
            var timestamp = new moment(inputTimestamp);
            return timestamp.isValid() ? timestamp.fromNow() : inputTimestamp;
        }
	};
});
