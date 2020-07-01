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
			if( i != 1 && i != 18 && i!= 22 && i!= 25  ) 
                        TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
                }

                TransXpedia.ISOMessage[0]               = '0210';
                TransXpedia.ISOMessage[39]              = appConfig.RESONSECODE;


                if( TransXpedia.REQUEST_TYPE == 'FT') {
			 TransXpedia.ISOMessage[104] = TransXpedia.REQUEST_ISOMESSAGE[104] + '063012908712345601'+
                                                       '071014Satya Adimulam072013Jakkur Branch';
                }

                TransXpedia.ISOMessage[125]  =  TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,6) + '|' +
                                                TransXpedia.REQUEST_ISOMESSAGE[37].slice(-6)  +
                                                TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,6); 
		

		return resolved(TransXpedia);
        }catch (e) {
            return rejected(e);
        }
   });
}
/* ************************************** */
function getRequestType(TransXpedia) {
        return new Promise((resolved, rejected) => {
                try {

			if(TransXpedia.REQUEST_ISOMESSAGE[3] == '900000')
				TransXpedia.REQUEST_TYPE = 'FT';
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] == '900001')
                                TransXpedia.REQUEST_TYPE = 'STATUS ENQUIRY';
                        else {
                                return rejected(`INVALID REQUEST TO IMPS CHANNEL ::: REQUEST TYPE ID [${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
                        }

			return resolved(TransXpedia);

                }catch(e) {
                        return rejected(e)
                }

        })
}
/* ************************************** */

