exports.unpack = function(msg, packager) {
	dataBuffer = msg.slice (0, packager.length);
	var data = '';
	for (var i = 0; i < packager.length; i++) {
		data = data + String.fromCharCode(dataBuffer[i]);
	}

	return {
		data : data,
		restData : msg.slice (packager.length)
	};
};

exports.pack = function(row, packager) {
	var msg = new Uint8Array(row.length);
	for (var i = 0; i < row.length; i++) {
		msg[i] = row.charCodeAt(i);
	}

	return {msg : msg};
};
