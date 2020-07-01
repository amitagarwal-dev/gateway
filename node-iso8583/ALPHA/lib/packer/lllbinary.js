exports.unpack = function(msg, packager) {
	var length = parseInt('' + String.fromCharCode(msg[0]) + String.fromCharCode(msg[1]) + String.fromCharCode(msg[2]));
	
	if(length > packager.length) {
		length = packager.length;
	}

	var RawBuffer = new Uint8Array (length);
	for (var i = 0; i < length; i++) {
		RawBuffer[i] = msg[i+3];
	}

	var result = {
		data : RawBuffer,
		restData: msg.slice(length + 3)
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
		msg = '00' + msg;
	} else if (length < 100) {
		msg = '0' + msg;
	}

	var msgBuffer = new Uint8Array (length+3);
	msgBuffer[0] = msg.charCodeAt(0);
	msgBuffer[1] = msg.charCodeAt(1);
	msgBuffer[2] = msg.charCodeAt(2);
	for (var i = 0; i < length; i++) {
		msgBuffer[i+3] = row[i];
	}
	
	return {
		msg : msgBuffer
	}
};

