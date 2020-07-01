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

        if(TransXpedia.REQUEST_TYPE == 'AE') {
		    for(var i in TransXpedia.REQUEST_ISOMESSAGE) {
		        if(( i != 0 && i != 1 && i != 18 && i!= 22 && i!= 24 && i!= 25 &&  i!= 127 && i!= 126) && !(i >= 111 && i <= 119) && !(i >= 122 && i <= 124) ) 
			        TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
            }
        } else {
            for(var i in TransXpedia.REQUEST_ISOMESSAGE) {
		        if((i == 0 || i == 2 || i == 7) ) 
			        TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
            }   
        }

        TransXpedia.ISOMessage[39] = appConfig.RESPONSECODE;

		if(TransXpedia.ISOMessage == '1200')
			TransXpedia.ISOMessage[0]   = '1210';
		
		if(appConfig.RESPONSECODE == '000') {
            if(TransXpedia.REQUEST_TYPE == 'AE') {
                TransXpedia.ISOMessage[125] = '45511257|SBOGP|936.51|30-08-1984 00:00:00|SETTIPALLY VENKATA LOKESH|9177774312';
                TransXpedia.ISOMessage[48] = Util.BALANCE;
            }else {
                TransXpedia.ISOMessage[39]  = '0  ';
                TransXpedia.ISOMessage[125] = '112233445566';  
            }
        }else {
            if(TransXpedia.REQUEST_TYPE == 'AS' || TransXpedia.REQUEST_TYPE == 'MS') {
                TransXpedia.ISOMessage[39]  = '1  ';
                TransXpedia.ISOMessage[125] = '112233445566';  
                TransXpedia.ISOMessage[126] = appConfig.RESPONSECODE;
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
			if (TransXpedia.REQUEST_ISOMESSAGE[3] == '970000')
				TransXpedia.REQUEST_TYPE = 'AE';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '151000' && TransXpedia.REQUEST_ISOMESSAGE[125] == 'ADHSEED')
				TransXpedia.REQUEST_TYPE = 'AS';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] == '151000' &&  TransXpedia.REQUEST_ISOMESSAGE[125] == 'MOBSEED')
				TransXpedia.REQUEST_TYPE = 'MS';
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
