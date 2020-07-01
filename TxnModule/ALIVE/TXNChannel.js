/* ************************************** */
const Util            = require('./utils');
const appConfig	      = require('../../config')

/* ************************************** */

/* ************************************** */
module.exports.ExtractReqAndframeResp = function (TransXpedia) {
	return new Promise((resolved, rejected) => { 
		getRequestType(TransXpedia)
		.then(frameResponseMsg)
		.then((TransXpedia) => {
			setTimeout(()=>{
				return resolved(TransXpedia);
			},appConfig.RESPONSEDELAY * 1000);
		}).catch((e)=>{
			return rejected(e)
		})
	});
}
/* ************************************** */

/* ************************************** */
function frameResponseMsg(TransXpedia) {
	return new Promise ((resolved, rejected) => {
	try {
		TransXpedia.ISOMessage = {};

		for(var i in TransXpedia.REQUEST_ISOMESSAGE) {
		  if(( i != 0 && i != 1 && i != 18 && i!= 22 && i!= 24 && i!= 25 &&  i!= 127 && i!= 126) && !(i >= 111 && i <= 119) && !(i >= 122 && i <= 124) ) 
			TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
		}

		if(TransXpedia.ISOMessage[0] == '1200')
			TransXpedia.ISOMessage[0]   = '1210';
		else 
			TransXpedia.ISOMessage[0]   = '1430';

		TransXpedia.ISOMessage[39]	 = appConfig.RESPONSECODE;

		if(appConfig.RESPONSECODE == '000') {

			TransXpedia.ISOMessage[48] 	= Util.BALANCE;
			
			TransXpedia.ISOMessage[62]  = Util.AUTHCODE;

			if( TransXpedia.REQUEST_TYPE == 'MS') {    
				TransXpedia.ISOMessage[125] 	= Util.MINISTATEMENT;
			}

			TransXpedia.ISOMessage[38] 	= 'UNI000';
			TransXpedia.ISOMessage[102] = '2134658790096785';

		}
		return resolved(TransXpedia);
	}catch (e) {
	    return rejected(e);
	}
   });
}
/* ************************************** */


/* ************************************** */
function getRequestType(TransXpedia) {
	return new Promise((resolved, rejected) => { 
		try {
			if (TransXpedia.REQUEST_ISOMESSAGE[3] == '311000')
				TransXpedia.REQUEST_TYPE = 'BE';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '381000')
				TransXpedia.REQUEST_TYPE = 'MS';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '401020')
				TransXpedia.REQUEST_TYPE = 'FT';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '480000')
				TransXpedia.REQUEST_TYPE = 'WITHDRAW';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '492010')
				TransXpedia.REQUEST_TYPE = 'DEPOSIT';
			else {
				return rejected(`INVALID REQUEST TO TXN CHANNEL ::: REQUEST TYPE IS [${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
			}
			return resolved(TransXpedia);
		}catch(e) {
			return rejected(e) 
		}
	});
}
/* ************************************** */
