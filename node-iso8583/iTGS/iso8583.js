/* *************************************************************************** */
//const errModule 	= require('../../Utils/error'); 
const ISOLIB 		= require ('./lib/iso8583');
const ISO 		= ISOLIB.ISO8583;
const packager  	= require ('./lib/packager/iTGS').packager;
const appConfiguration 	= require('../../InitialiseGateway/initGateway').appConfiguration;
/* *************************************************************************** */

/* *************************************************************************** */
module.exports.UnwarpISOMessage = function UnwarpISOMessage (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		var _HeaderLength 	= packager.HeaderLength;
		var _ISOMessageBuffer 	= TransXpedia.REQUEST_BUFFER;
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
//			TransXpedia.serverError = errModule.E_ISO8583_MESSAGE_UNPACKING;
			TransXpedia.errDescription = `ISO8583 MESSAGE UNPACKING FAILED ` + 
				`[FUNCTION : UnwarpISOMessage]`;
			return rejected (TransXpedia);
		}
	});
};


module.exports.WarpISOMessage = function w_WarpISOMessage(TransXpedia) {
	return new Promise((resolved, rejected) => {
		WarpISOMessage(TransXpedia)
		.then(FrameiTGSHeader)
		.then((TransXpedia) => {return resolved(TransXpedia)})
		.catch((TransXpedia) => { return rejected(TransXpedia) })
	})
}
	
	
	
function WarpISOMessage (TransXpedia) {
	return new Promise((resolved, rejected) => {
		try {
			var iso 				= new ISO(packager);
			var ISOMessageBuffer    = iso.pack(TransXpedia.ISOMessage);
			var _HeaderLength		= packager.HeaderLength;

			TransXpedia.RESPONSE_BUFFER = new Uint8Array (ISOMessageBuffer.length+_HeaderLength);
			for (var i = 0; i < ISOMessageBuffer.length; i++) {
				TransXpedia.RESPONSE_BUFFER[i+_HeaderLength] = ISOMessageBuffer[i];
			}


			return resolved(TransXpedia);
		}
		catch (e) {
			console.log(e);
			return rejected(e);
		}
	});
};


function FrameiTGSHeader(TransXpedia) {
	return new Promise((resolved, rejected) => {
		try {

			for (var i = 0; i < packager.HeaderLength-2; i++) {
				TransXpedia.RESPONSE_BUFFER[i] = TransXpedia.REQUEST_BUFFER[i];
			}
			var RESPONSE_BUFFER_LENGTH 		= TransXpedia.RESPONSE_BUFFER.length-9;
			TransXpedia.RESPONSE_BUFFER[7] = (RESPONSE_BUFFER_LENGTH >> 8) & 0x00FF;
			TransXpedia.RESPONSE_BUFFER[8] = RESPONSE_BUFFER_LENGTH & 0x00FF;

			return resolved(TransXpedia);
		} catch(e) {
			console.log(e)
			return rejected(e);
		}

	})
}
/* *************************************************************************** */
