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

                for(var i in TransXpedia.REQUEST_ISOMESSAGE) {
                  if( (i != 1 && i != 18 && i!= 22 && i!= 25 &&  i != 127 && i != 126) && !(i >= 111 && i <= 119) && !(i >= 121 && i <= 123) ) 
                        TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
                }
		
                TransXpedia.ISOMessage[0]               = '0210';
                TransXpedia.ISOMessage[39]              = appConfig.RESPONSECODE;
                TransXpedia.ISOMessage[54]              = Util.BALANCE;

                if(TransXpedia.REQUEST_TYPE == 'AADHAAR ENQUIRY')
                        TransXpedia.ISOMessage[62]              = Util.AUTHCODE;

                if(appConfig.RESPONSECODE == '00') {

                        TransXpedia.ISOMessage[102]     = '123456789012';

			if(TransXpedia.REQUEST_TYPE == 'MULTIPLE AADHAAR ENQUIRY')
                        	TransXpedia.ISOMessage[104]     = '079064123456|1234567|47382473827824|amit agarwal|849328492384392|ullas';
			else 
                        	TransXpedia.ISOMessage[104]     = '001006112233003009HDK410936004010Sri Ganesh075006Active';
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
		    if(TransXpedia.REQUEST_ISOMESSAGE[111] != undefined && TransXpedia.REQUEST_ISOMESSAGE[121] != undefined) {
			if(TransXpedia.REQUEST_ISOMESSAGE[3] == 'AE0001') {
                        	TransXpedia.REQUEST_TYPE = 'MULTIPLE AADHAAR ENQUIRY';
			}else {
                        	TransXpedia.REQUEST_TYPE = 'AADHAAR ENQUIRY';
			}
		    }
                    else 
                        TransXpedia.REQUEST_TYPE = 'ACCOUNT ENQUIRY';
        
                    return resolved(TransXpedia);
		}catch(e) {
			return rejected(e) 
		}
	});
}
/* ************************************** */
