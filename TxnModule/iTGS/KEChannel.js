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
			return rejected(e);
		})
	});
}
/* ************************************** */

/* ************************************** */
function frameResponseMsg(TransXpedia) {
    return new Promise ((resolved, rejected) => {
    try {
        TransXpedia.ISOMessage = {};

		TransXpedia.ISOMessage[0]   = '0810';

		TransXpedia.ISOMessage[39]  	= appConfig.RESPONSECODE;
        
        if(appConfig.RESPONSECODE == '00') {
            TransXpedia.ISOMessage[48]      = '[032][F23C80012E81801CD548D5412E81801C]';
            TransXpedia.ISOMessage[104]     = TransXpedia.REQUEST_ISOMESSAGE[104] +'003015NGV Koramangala';
        }

		TransXpedia.ISOMessage[125]   = TransXpedia.REQUEST_ISOMESSAGE[37].slice(5,10) + TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,5) + TransXpedia.REQUEST_ISOMESSAGE[37].slice(-2);
		TransXpedia.ISOMessage[125]   = TransXpedia.ISOMessage[125].slice(-6) + '|' + TransXpedia.ISOMessage[125];

												
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

			if (TransXpedia.REQUEST_ISOMESSAGE[3] == 'KE0000')
				TransXpedia.REQUEST_TYPE = 'KE';
			else {
                return rejected(`INVALID REQUEST TO KEY EXCHANGE CHANNEL ::: REQUEST TYPE[${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
            }
			return resolved(TransXpedia);

		}catch(e) {
			return rejected(e); 
		}
	})
}
/* ************************************** */
