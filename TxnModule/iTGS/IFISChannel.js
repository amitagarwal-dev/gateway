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
            if( (i != 1 && i != 18 && i!= 22 && i!= 25 && i!=54 && i!=52 && i!= 61 && i != 63 && i!=104 && i != 127 && i != 126) ) 
                TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
        }
			
		if(TransXpedia.ISOMessage[0] == '0200')
			TransXpedia.ISOMessage[0]   = '0210';
		else 
			TransXpedia.ISOMessage[0]   = '0430';


		TransXpedia.ISOMessage[39]  	= appConfig.RESPONSECODE;
		
		if(TransXpedia.ISOMessage[104 != undefined])
			TransXpedia.ISOMessage[104]	= TransXpedia.REQUEST_ISOMESSAGE[104] +'015008Sreedevi';
		
			TransXpedia.ISOMessage[125]   = TransXpedia.REQUEST_ISOMESSAGE[37].slice(5,10) + TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,5) + TransXpedia.REQUEST_ISOMESSAGE[37].slice(-2);
			TransXpedia.ISOMessage[125]   = TransXpedia.ISOMessage[125].slice(-6) + '|' + TransXpedia.ISOMessage[125];
	
		
		if( TransXpedia.REQUEST_TYPE == 'MS')    
          		TransXpedia.ISOMessage[120] 	= Util.MINISTATEMENT;
       		
		if(TransXpedia.REQUEST_TYPE != 'MS')	
			TransXpedia.ISOMessage[54] 		= Util.BALANCE;
										
		
		
	   	
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

			if (TransXpedia.REQUEST_ISOMESSAGE[3] == '010000')
				TransXpedia.REQUEST_TYPE = 'WITHDRAWAL';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='210000')
				TransXpedia.REQUEST_TYPE = 'DEPOSIT';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='310000')
				TransXpedia.REQUEST_TYPE = 'BE';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.REQUEST_ISOMESSAGE[120].indexOf('07')== 6)
				TransXpedia.REQUEST_TYPE = 'MS';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.REQUEST_ISOMESSAGE[120].indexOf('45')== 6)
				TransXpedia.REQUEST_TYPE = 'FT';
			else {
				return rejected(`INVALID REQUEST TO IFIS CHANNEL ::: REQUEST TYPE ID [${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
			}
			return resolved(TransXpedia);

		}catch(e) {
			return rejected(e) 
		}

	})
}
/* ************************************** */

