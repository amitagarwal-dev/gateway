exports.unpack = function(msg, packager) {
	var msgBuffer = msg.slice (0, packager.length);
	var data = '';
	for (var i = 0; i < packager.length; i++) {
		data = '' + String.fromCharCode(msgBuffer[i]);
	}
	return {
		data: data,
		restData: msg.slice(packager.length)
	};
};

exports.pack = function(row, packager) {
	var msgBuffer = new Uint8Array(row.length);
	for (var i = 0; i < row.length; i++) {
		msgBuffer[i] = row.charCodeAt(i); 
	}
	return {
		msg: msgBuffer
	};
};

