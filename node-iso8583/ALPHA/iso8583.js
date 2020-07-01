/* *************************************************************************** */
const errModule 	= require('../../Utils/error'); 
const ISOLIB 		= require ('./lib/iso8583');
const ISO 			= ISOLIB.ISO8583;

const packager  = require ('./lib/packager/Aplha').packager;
const appConfiguration = require('../../InitialiseGateway/initGateway').appConfiguration;
/* *************************************************************************** */

/* *************************************************************************** */
module.exports.UnwarpISOMessage = function UnwarpISOMessage (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		var _HeaderLength 	= packager.HeaderLength;
		var _ISOMessageBuffer 	= TransXpedia.ISOBUFFER_RESPONSE;
		try {
			var iso 	= new ISO(packager);
			var ISOMessage 	= iso.unpack(_ISOMessageBuffer.slice(_HeaderLength));
			/*
			console.log ('###################### CLIENT ISO MESSAGE #########################');
			for (var i in ISOMessage)
			{
				if (i != 63 && i != 127 && i != 1)
				console.log ('Field[' + i + '] : ' + ISOMessage[i]);
				else
				console.log ('Field[' + i + '] : BINARY');
			};
			console.log ('###################### ###### ### ####### #########################');
			*/
			TransXpedia.RESPONSE_ISOMESSAGE = ISOMessage;
			return resolved (TransXpedia);
		}
		catch (e) {
			TransXpedia.systemErr   = e;
			TransXpedia.serverError = errModule.E_ISO8583_MESSAGE_UNPACKING;
			TransXpedia.errDescription = `ISO8583 MESSAGE UNPACKING FAILED ` + 
				`[FUNCTION : ${UnwarpISOMessage.name}]`;
			return rejected (TransXpedia);
		}
	});
};


module.exports.WarpISOMessage = function WarpISOMessage (TransXpedia) {
	return new Promise((resolved, rejected) => {
		try {
			var iso 		= new ISO(packager);
			var ISOMessageBuffer 	= iso.pack(TransXpedia.ISOMessage);
			var _HeaderLength	= packager.HeaderLength;

			var RespClient = new Uint8Array (ISOMessageBuffer.length+_HeaderLength);
			for (var i = 0; i < ISOMessageBuffer.length; i++) {
				RespClient[i+_HeaderLength] = ISOMessageBuffer[i];
			}
			FrameALPHAHeader (RespClient);
			TransXpedia.ISOBUFFER_REQUEST = RespClient;
			return resolved(TransXpedia);
		}
		catch (e) {
			TransXpedia.systemErr   = e;
			TransXpedia.serverError = errModule.E_ISO8583_MESSAGE_PACKING;
			TransXpedia.errDescription = `ISO8583 MESSAGE PACKING FAILED ` +
				`[FUNCTION : ${WarpISOMessage.name}]`;
			return rejected(TransXpedia);
		}
	});
};


function FrameALPHAHeader(ISOMessageBuffer) {
	var ISOMessageLength = ISOMessageBuffer.length-2;
	ISOMessageBuffer[0] = (ISOMessageLength >> 8) & 0x00FF;
	ISOMessageBuffer[1] = ISOMessageLength & 0x00FF;

	return;
}
/* *************************************************************************** */
