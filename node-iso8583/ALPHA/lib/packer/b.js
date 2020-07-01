var bignum = require('./node_modules/bignumber.js');

exports.unpack = function(msg, packager) {
	var bitmapLength;
	var fieldIds = [];
	if ((msg[0] & 0x080) == 0x080) bitmapLength = 16; else bitmapLength = 8;

	bitmapBuffer = msg.slice (0, bitmapLength);
	for (var i = 0; i < bitmapLength; i++) {
		for (var x = 0; x <= 8; x++) {
			if (((bitmapBuffer[i] << x) & 0x080) == 0x080) fieldIds.push (x + (8*i) + 1);
		}
	}

	return {
		data: bitmapBuffer,
		fieldIds: fieldIds.slice(1),
		restData: msg.slice (bitmapLength)
	};
};

exports.pack = function(data, packager) {
	var bitmap  = '';

	var secBitmap = false;
	for (var x in data) { 
		if (x > 64) { secBitmap = true; break;}
	};


	var lastIndex = 0;
	for (var i in data) {
		if (secBitmap == false && i > 1) {
			var offset = i - lastIndex - 1;
			for(var j = 0; j < offset; j++) {
				bitmap += '0';
			}
			bitmap += '1';
			lastIndex = i;
		}
		else if (secBitmap == true && i >= 1) {
			var offset = i - lastIndex - 1;
			for(var j = 0; j < offset; j++) {
				bitmap += '0';
			}
			bitmap += '1';
			lastIndex = i;
		}
	}

	var blength = bitmap.length;
	var length = Math.ceil(blength / (packager.length * 4)) * (packager.length * 4);

	for(var i = 0; i < length - blength; i++) {
		bitmap += '0';
	}

	var msg = new bignum(bitmap,2).toString(16).toUpperCase();
	var msgBuffer = new Uint8Array(msg.length/2);

	for (var i = 0; i < msg.length/2; i++) {
		msgBuffer[i] = (parseInt (msg[2*i], 16) << 4) | parseInt (msg[(2*i)+1], 16);
		
	}

	return {
		msg : msgBuffer,
		bitmap: bitmap
	};
};
