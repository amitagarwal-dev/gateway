exports.unpack = function(msg, packager) {
	var length = parseInt ('' + String.fromCharCode(msg[0]) + String.fromCharCode(msg[1]), 10);
	
	if(length > packager.length) {
		length = packager.length;
	}

	var dataBuffer = msg.slice (2, length+2);
	var data = '';
	for (var i = 0; i < length; i++) {
		data = data + String.fromCharCode(dataBuffer[i])
	}

	
	var result = {
		data : data,
		restData: msg.slice(length + 2),
	};
	
	return result;
};

exports.pack = function(row, packager) {
	var length = row.length;
	if (length > packager.length) {
		length = packager.length;
	}
	
	var msg = '' + length;
	if (length < 10) {
		msg = '0' + msg;
	}
	
	var msgBuffer = new Uint8Array (length+2);
	msgBuffer[0] = msg.charCodeAt(0);
	msgBuffer[1] = msg.charCodeAt(1);
	for (var i = 0; i < length; i++) {
		msgBuffer[i+2] = row.charCodeAt(i);
	}
	return {
		msg : msgBuffer
	}
};
