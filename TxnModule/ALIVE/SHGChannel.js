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

		if(TransXpedia.REQUEST_TYPE == 'AUTHENTICATION') {
			for(var i in TransXpedia.REQUEST_ISOMESSAGE) {
				if( i == 1 || i == 2 || i == 7 ) 
			  		TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
		  	}
		} else {
			for(var i in TransXpedia.REQUEST_ISOMESSAGE) {
		  		if( (i != 0 && i != 1 && i != 22 && i!= 24 && i!= 43 && i!= 127 && i!= 126) && !(i >= 111 && i <= 119) && !(i >= 122 && i <= 124))
					TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
			}
		}
		
		if(TransXpedia.ISOMessage[0] == '1200')
			TransXpedia.ISOMessage[0]  = '1210';
		else 
			TransXpedia.ISOMessage[0] = '1430';

		TransXpedia.ISOMessage[39]   = appConfig.RESPONSECODE;

		if(appConfig.RESPONSECODE == '000') {

			if(TransXpedia.REQUEST_TYPE == 'AUTHENTICATION') {
				TransXpedia.ISOMessage[39]   = '0  ';
				TransXpedia.ISOMessage[125]  = '112233445566';
			}

			if(TransXpedia.REQUEST_TYPE == 'DUALSHG AE')
				TransXpedia.ISOMessage = '37924680|SANGISETTI DEVI|896122413625|51795867|SANGITA  DURGA DEVI|658751696342';

			if(TransXpedia.REQUEST_TYPE == 'SHG AE' || TransXpedia.REQUEST_TYPE == 'DEPOSIT' || TransXpedia.REQUEST_TYPE == 'FT')
				TransXpedia.ISOMessage[48] 	= Util.BALANCE;

			if(TransXpedia.REQUEST_TYPE == 'SHG AE') {
				TransXpedia.ISOMessage[102] = '012        1179    1179123145678901';
				TransXpedia.ISOMessage[125] = 'Sharat Kumar';
			}

		} else {
			if(TransXpedia.REQUEST_TYPE == 'AUTHENTICATION') {
				TransXpedia.ISOMessage[39]   = '1  ';
				TransXpedia.ISOMessage[125]  = '112233445566';
			}

			if(TransXpedia.REQUEST_TYPE == 'DEPOSIT')
				TransXpedia.ISOMessage[125] = 'Gateway Error Description';
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
			if (TransXpedia.REQUEST_ISOMESSAGE[125] == 'SHGVLDT')
				TransXpedia.REQUEST_TYPE = 'DUALSHG AE';
			else if(TransXpedia.REQUEST_ISOMESSAGE[123] == 'OLV' && TransXpedia.REQUEST_ISOMESSAGE[3] == '970000') 
				TransXpedia.REQUEST_TYPE = 'SHG AE';
			else if(TransXpedia.REQUEST_ISOMESSAGE[125] == 'SHGVLDT1')
				TransXpedia.REQUEST_TYPE = 'AUTHENTICATION';
			else if(TransXpedia.REQUEST_ISOMESSAGE[123] == 'OLV' && TransXpedia.REQUEST_ISOMESSAGE[3] == '492010') 
				TransXpedia.REQUEST_TYPE = 'DEPOSIT';	
			else if(TransXpedia.REQUEST_ISOMESSAGE[125] == 'SHGVLDT2' && TransXpedia.REQUEST_ISOMESSAGE[3] == '161000')
				TransXpedia.REQUEST_TYPE = 'FT';
			else {
				return rejected(`INVALID REQUEST TO SHG CHANNEL ::: REQUEST TYPE IS [${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
			}
			return resolved(TransXpedia);
		}catch(e) {
			return rejected(e) 
		}

	});
}
/* ************************************** */
