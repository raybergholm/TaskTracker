sap.ui.define([], function() {
    "use strict";

	return {
        userFriendlyTimestamp: function(dInputTimestamp){
            var timestamp = new moment(dInputTimestamp);
            return timestamp.isValid() ? timestamp.fromNow() : dInputTimestamp;
        }
	};
});
