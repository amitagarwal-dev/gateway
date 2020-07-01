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
            if( (i != 1 && i != 18 && i!= 22 && i!= 25 )) 
                TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
        }
			
		if(TransXpedia.ISOMessage[0] == '0200')
			TransXpedia.ISOMessage[0]   = '0210';
		else 
			TransXpedia.ISOMessage[0]   = '0430';


        if(appConfig.RESPONSECODE == '00' && TransXpedia.ISOMessage[0] != '0430') {
            TransXpedia.ISOMessage[54] 		= Util.BALANCE;
        }
        
        if( appConfig.RESPONSECODE == '00' && TransXpedia.REQUEST_TYPE == 'MS')    
          		TransXpedia.ISOMessage[120] 	= Util.MINISTATEMENT;
		
        TransXpedia.ISOMessage[39]  	= appConfig.RESPONSECODE;
          
		TransXpedia.ISOMessage[125]     = TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,6) + '|' + 
                						  TransXpedia.REQUEST_ISOMESSAGE[37].slice(-6) + 
                						  TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,6);
		       			   	
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

			if (TransXpedia.REQUEST_ISOMESSAGE[3] =='210000')
				TransXpedia.REQUEST_TYPE = 'DEPOSIT';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='310000')
				TransXpedia.REQUEST_TYPE = 'BE';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.REQUEST_ISOMESSAGE[120].indexOf('07')== 6)
				TransXpedia.REQUEST_TYPE = 'MS';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.REQUEST_ISOMESSAGE[120].indexOf('45')== 6)
                TransXpedia.REQUEST_TYPE = 'FT';
            else {
                return rejected(`INVALID REQUEST TO LOAN CHANNEL ::: REQUEST TYPE IS [${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
            }
			return resolved(TransXpedia);

		}catch(e) {
            return rejected(e); 
		}
	})
}
/* ************************************** */

