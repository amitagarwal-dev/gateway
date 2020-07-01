/* ************************************** */
const Util            = require('./utils');
const appConfig	      = require('../../config')

/* ************************************** */

/* ************************************** */
module.exports.ExtractReqAndframeResp = function (TransXpedia) {
	return new Promise((resolved, rejected) => {
		frameResponseMsg(TransXpedia)
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
			TransXpedia.ISOMessage[0] = '1210';
		
		TransXpedia.ISOMessage[39]	= appConfig.RESPONSECODE;

		if(appConfig.RESPONSECODE == '000') {
			TransXpedia.ISOMessage[48] 	= Util.BALANCE;
			TransXpedia.ISOMessage[62]  = Util.AUTHCODE;
			TransXpedia.ISOMessage[106] = 'TDO|5243396061234|Recurring Deposit|12|0|200|RDGFI|N|';
			TransXpedia.ISOMessage[107] = 'ErrorCode=11230&amp;Account number=133520100042827&amp;Maturity Date=23-04-2020&amp;Maturity Amount=1220&amp;Rate Of Interest=5.75';
		}else {
			TransXpedia.ISOMessage[125] = 'Gateway Error Description';
		}

		return resolved(TransXpedia);
	}catch (e) {
	    return rejected(e);
	}
   });
}
/* ************************************** */