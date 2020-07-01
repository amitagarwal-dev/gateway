var util = require('util');
var ISO8583 = function(packager) {
	packager && (this.packager = packager);

	this.fields = {};

	this._unpack = function(msg, id) {
		var result;
		try {
			var packager = this.packager[id];
			result = require('./packer/' + packager.type).unpack(msg, packager);
			this.fields[id] = result.data;
		} catch(e) {
			var errMsg = 'Error unpacking data from bit ' + id + '\nPackager: ' + util.inspect(packager);
			console.error(errMsg);
			throw new Error(errMsg + ': ' + e.message);
		}
		return result;
	};

	this._pack = function(row, id) {
		var result;
		try {
			var packager = this.packager[id];
			result = require('./packer/' + packager.type).pack(row, packager);
		} catch(e) {
			var errMsg = 'Error packing data from bit ' + id + '\nPackager: ' + util.inspect(packager);
			console.error(errMsg);
			throw new Error(errMsg + ': ' + e.message);
		}
		return result;
	};

	this.unpack = function(msg) {
		var result;
		var fields = {};
		var logbuf = {};

		result = this._unpack(msg, 0);
		fields['0'] = result.data;
		result = this._unpack(result.restData, 1);
		fields['1'] = result.data;
		var fieldIds = result.fieldIds;

		for(var i in fieldIds) {
			result = this._unpack(result.restData, fieldIds[i]);
			fields[i] = result.data;

			let key = 'bit'+i;
		
		}
		return this.fields;
	};

	this._sort = function(o) {
		var sorted = {},
		key, a = [];

		for (key in o) {
			if (o.hasOwnProperty(key)) {
					a.push(key);
			}
		}

		a.sort();

		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = o[a[key]];
		}
		return sorted;
	};

	this.pack = function(data) {
		var logbuf = {};
		var retMsg = new Uint8Array(2048*3), retMap = {};
		var result;
		data[1] = '';
		var index = 0;
		data = this._sort(data);
		for(var i in data) {
			if (i == 1) {
				result = this._pack(data, i);
				//logbuf[1] = result;
				logbuf[1] = result.bitmap;
			} else {
				logbuf[i] = data[i];
				result = this._pack(data[i], i);
			}

			for (var i = 0; i < result.msg.length; i++) {
				retMsg[index] = result.msg[i];
				index++;
			}
		}
		/* ********************************** */
        //for console log
		retMsg = retMsg.slice (0, index);
		console.log('\n\n+. ---------- RESPONSE TO IPOS ----------------- +\n')
			 
			for(var i in logbuf) {
				if(i == 1 ) 
					Field = ('Bit' + i + '   ').slice(0,7) + ':  ' + parseInt(logbuf[i],2).toString(16);
				else if((i >= 111 && i <= 119) || (i >= 121 && i <= 123) || i == 127 ) 
					Field = ('Bit' + i + '   ').slice(0,7) + ':  ' + 'BINARY DATA';
				else
				   Field = ('Bit' + i + '   ').slice(0,7) + ':  ' + logbuf[i].toString();

				console.log(Field);
			}

			console.log('\n+ ---------------------------------------------- +\n')
			/* ********************************** */
		return retMsg;
	};
};

exports.ISO8583 = ISO8583;
