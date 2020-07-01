/* **************************************************** */
const iso8583 	      = require('../node-iso8583/isoModule.js');
const txnModule       = require('../TxnModule/txnModule');

/* **************************************************** */


/* **************************************************** */
module.exports = function(socket, ClientReqBuffer) {
	
	var TransXpedia 	       = {};
	TransXpedia.REQUEST_BUFFER = ClientReqBuffer;
	
	iso8583.iTGS.ISO8583.UnwarpISOMessage(TransXpedia)
	.then(getiTGSChannelType)
	.then((TransXpedia) => {
		return new Promise((resolved, rejected) => {
			txnModule.iTGS[TransXpedia.CHANNEL].ExtractReqAndframeResp(TransXpedia)
			.then((TransXpedia)=>{
					return resolved(TransXpedia)
			}).catch((e)=>{
				return rejected(e);
			})			
		 })
	})
	.then(iso8583.iTGS.ISO8583.WarpISOMessage) 
	.then((TransXpedia) => {
		socket.write(Buffer.from(TransXpedia.RESPONSE_BUFFER));
		socket.destroy();
	}).catch((e) => {
		console.log('REQUEST PROCESSING FAILED :: ' + JSON.stringify(e));
		socket.destroy();
	});
}
/* **************************************************** */

/* **************************************************** */
function getiTGSChannelType(TransXpedia) {
	return new Promise((resolved, rejected)=>{
	  try {

		var RoutingKey = TransXpedia.REQUEST_BUFFER[1] + TransXpedia.REQUEST_BUFFER[2] + TransXpedia.REQUEST_BUFFER[3] + TransXpedia.REQUEST_BUFFER[4];
		
		
		RoutingKey     = parseInt(RoutingKey);

		TransXpedia.ROUTINGKEY = RoutingKey;

		switch(RoutingKey) {
			case 0 	:
					TransXpedia.CHANNEL = 'AEPS';
					break;
			case 1 	:
					TransXpedia.CHANNEL = 'TPD';
					break;
			case 4  :
					TransXpedia.CHANNEL = 'IFIS';
					break;
			case 5  :
					TransXpedia.CHANNEL = 'PIN';
					break;
			case 6  : 
					TransXpedia.CHANNEL = 'KEY EXCHANGE';
					break;
			case 7  :
					TransXpedia.CHANNEL = 'AE';
					break;
			case 8  :
			case 11 :	
					TransXpedia.CHANNEL = 'SHG';
					break;
			case 9  : 
					TransXpedia.CHANNEL = 'IMPS';
					break;
			case 10 :
					TransXpedia.CHANNEL = 'LOAN';
					break;
			default :
					return rejected(`Invalid Rounting Key :: Key is ${RoutingKey}`);
		}
		return resolved(TransXpedia);
	  }catch(e) {
		return rejected(e);
	  }

	})
}
/* **************************************************** */




