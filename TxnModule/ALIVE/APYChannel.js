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
        
        TransXpedia.ISOMessage[39] = appConfig.RESPONSECODE;

		TransXpedia.ISOMessage[0]   = '1210';
		
		if(appConfig.RESPONSECODE == '000') {
            if(TransXpedia.REQUEST_TYPE == 'AE') {
                TransXpedia.ISOMessage[102] = '20179177774312';
                TransXpedia.ISOMessage[48] = Util.BALANCE;
				TransXpedia.ISOMessage[62]  = Util.AUTHCODE;
            }else {
                TransXpedia.ISOMessage[48] = Util.BALANCE;
                TransXpedia.ISOMessage[125] = '50490884|SBOST|13243.15|21-05-1990 00:00:00| MAHADEVAMANGALAM PRASAD|917708878217|TOKEN';  
            }
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
			if (TransXpedia.REQUEST_ISOMESSAGE[3] == '970000' && TransXpedia.REQUEST_ISOMESSAGE[125] == 'APY')
				TransXpedia.REQUEST_TYPE = 'AE';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '970000' && TransXpedia.REQUEST_ISOMESSAGE[125] == 'ACTINFO')
				TransXpedia.REQUEST_TYPE = 'ACTINFO';
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
