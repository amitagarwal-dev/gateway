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
		  if(i == 0 || i == 2 || i == 7 ) 
			TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
		}

		if(TransXpedia.ISOMessage[0] == '1200')
			TransXpedia.ISOMessage[0]   = '1210';
		else 
			TransXpedia.ISOMessage[0]   = '1430';

        TransXpedia.ISOMessage[125] 	= '1234560987651';

		if(appConfig.RESPONSECODE == '000') {
            TransXpedia.ISOMessage[39]	 = '0  ';
		}else {
            TransXpedia.ISOMessage[39]	 = '1  ';
            TransXpedia.ISOMessage[126]  = appConfig.RESPONSECODE;
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
			if (TransXpedia.REQUEST_ISOMESSAGE[3] == '151000')
				TransXpedia.REQUEST_TYPE = 'BCLOGIN';
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
