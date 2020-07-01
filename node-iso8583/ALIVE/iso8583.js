/* *************************************************************************** */
//const errModule 	= require('../../Utils/error'); 
const ISOLIB 		= require ('./lib/iso8583');
const ISO 		= ISOLIB.ISO8583;
const packager		= require ('./lib/packager/ALIVE').packager;
/* *************************************************************************** */

/* *************************************************************************** */
module.exports.UnwarpISOMessage = function UnwarpISOMessage (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		var _HeaderLength 	= packager.HeaderLength;
		var _ISOMessageBuffer 	= TransXpedia.REQUEST_BUFFER;
		try {

			var iso 	= new ISO(packager);
			var ISOMessage 	= iso.unpack(_ISOMessageBuffer.slice(_HeaderLength));
			TransXpedia.REQUEST_ISOMESSAGE = ISOMessage;
			
			console.log('\n\n+. ---------- REQUEST FROM IPOS ----------------- +\n')
		
			for(var i in ISOMessage) {
				if(i == 1 ) 
					Field = ('Bit' + i + '   ').slice(0,7) + ':  ' + ISOMessage[i].toString('hex');
				else if((i >= 111 && i <= 119) || (i >= 121 && i <= 123) || i == 127 ) 
					Field = ('Bit' + i + '   ').slice(0,7) + ':  ' + 'BINARY DATA';
				else
				   Field = ('Bit' + i + '   ').slice(0,7) + ':  ' + ISOMessage[i].toString();

				console.log(Field);
			}
			console.log('\n+ ---------------------------------------------- +\n')

			return resolved (TransXpedia);

		}
		catch (e) {
			TransXpedia.systemErr   = e;
			//TransXpedia.serverError = errModule.E_ISO8583_MESSAGE_UNPACKING;
			TransXpedia.errDescription = `ISO8583 MESSAGE UNPACKING FAILED ` + 
				`[FUNCTION : UnwarpISOMessage]`;
			return rejected (TransXpedia);
		}
	});
};

module.exports.WarpISOMessage = function w_WarpISOMessage(TransXpedia) {
	return new Promise((resolved, rejected) => {
		WarpISOMessage(TransXpedia)
		.then(FrameGatewayHeader)
		.then((TransXpedia) => {return resolved(TransXpedia)})
		.catch((TransXpedia) => { return rejected(TransXpedia) })
	})
}

function WarpISOMessage (TransXpedia) {
	return new Promise((resolved, rejected) => {
		try {
			var iso 		      = new ISO(packager);
			var ISOMessageBuffer  = iso.pack(TransXpedia.ISOMessage);
			var _HeaderLength	  = packager.HeaderLength;

			TransXpedia.RESPONSE_BUFFER = new Uint8Array(ISOMessageBuffer.length + _HeaderLength);
			for (var i = 0; i < ISOMessageBuffer.length; i++) {
				//TransXpedia.REQUEST_BUFFER[i+_HeaderLength] = ISOMessageBuffer[i];
				TransXpedia.RESPONSE_BUFFER[i+_HeaderLength] = ISOMessageBuffer[i];

			}
			return resolved(TransXpedia);
		}
		catch (e) {
			console.log(e);
			TransXpedia.systemErr   = e;
			//TransXpedia.serverError = errModule.E_ISO8583_MESSAGE_PACKING;
			TransXpedia.errDescription = `ISO8583 MESSAGE PACKING FAILED ` +
				`[FUNCTION : WarpISOMessage]`;
			return rejected(TransXpedia);
		}
	});
};


function FrameGatewayHeader(TransXpedia) {
	return new Promise((resolved, rejected) => {
		try {
			var ISOMessageLength = TransXpedia.RESPONSE_BUFFER.length - packager.HeaderLength;

			TransXpedia.RESPONSE_BUFFER[0] = (ISOMessageLength >> 8) & 0x00FF;
			TransXpedia.RESPONSE_BUFFER[1] = ISOMessageLength & 0x00FF;

			return resolved(TransXpedia);
		} catch(e) {
			console.log(e);
			return rejected(e);
		}
	});
}
/*
function FrameGatewayHeader(TransXpedia) {
	return new Promise((resolved, rejected) => {
		try {
			var ISOMessageLength = TransXpedia.REQUEST_BUFFER.length - packager.HeaderLength;

			TransXpedia.REQUEST_BUFFER[0] = (ISOMessageLength >> 8) & 0x00FF;
			TransXpedia.REQUEST_BUFFER[1] = ISOMessageLength & 0x00FF;

			return resolved(TransXpedia);
		} catch(e) {
			TransXpedia.systemErr   = e;
			TransXpedia.serverError = errModule.E_ISO8583_HEADER_FRAMING;
			TransXpedia.errDescription = `ISO8583 MESSAGE HEADER FRAMING FAILED [FUNCTION : FrameGatewayHeader]`;
			return rejected(TransXpedia);
		}
	});
}
*/
/* *************************************************************************** */
