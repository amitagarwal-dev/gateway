
/* **************************************************** */
const iso8583 	      = require('../node-iso8583/isoModule.js');
const txnModule       = require('../TxnModule/txnModule');

/* **************************************************** */


/* **************************************************** */
module.exports = function(socket, ClientReqBuffer) {
	
	var TransXpedia 	       = {};
	TransXpedia.REQUEST_BUFFER = ClientReqBuffer;

	iso8583.ALIVE.ISO8583.UnwarpISOMessage(TransXpedia)
	.then(getALIVEChannelType)
	.then((TransXpedia) => {
		return new Promise((resolved, rejected) => {
			txnModule.ALIVE[TransXpedia.CHANNEL].ExtractReqAndframeResp(TransXpedia)
			.then((TransXpedia)=>{
							return resolved(TransXpedia)
			}).catch((e)=>{
				console.log('error')
				return rejected(e);
			})			
		 })
	})
	
	.then(iso8583.ALIVE.ISO8583.WarpISOMessage) 
	.then((TransXpedia) => {
			socket.write(Buffer.from(TransXpedia.RESPONSE_BUFFER));
			socket.destroy();	
	}).catch((e) => {
			console.log('REQUEST PROCESSING FAILED ::: ' + JSON.stringify(e));
			socket.destroy();
	});
	
}

/* **************************************************** */
function getALIVEChannelType(TransXpedia) {
	return new Promise((resolved, rejected)=>{
	  try {
           	if(TransXpedia.REQUEST_ISOMESSAGE[125] == 'RDGFI')
                TransXpedia.CHANNEL = 'RD';
            else if( TransXpedia.REQUEST_ISOMESSAGE[125] == 'SHGVLDT' || TransXpedia.REQUEST_ISOMESSAGE[125] == 'SHGVLDT1' || TransXpedia.REQUEST_ISOMESSAGE[125] == 'SHGVLDT2' || TransXpedia.REQUEST_ISOMESSAGE[123] == 'OLV' )
                TransXpedia.CHANNEL = 'SHG';   
			else if(TransXpedia.REQUEST_ISOMESSAGE[123] == 'SED')
			     TransXpedia.CHANNEL = 'SEEDIG';
			else if(TransXpedia.REQUEST_ISOMESSAGE[125] == 'BCLOGIN')
				TransXpedia.CHANNEL = 'AGENTLOGIN';
			else if(TransXpedia.REQUEST_ISOMESSAGE[125] == 'APY' || TransXpedia.REQUEST_ISOMESSAGE[125] == 'ACTINFO')
				TransXpedia.CHANNEL = 'APY';
            		else 
			     TransXpedia.CHANNEL = 'TXN';
		return resolved(TransXpedia);
	  }catch(e) {
		return rejected(e);
	  }

	})
}
/* **************************************************** */
