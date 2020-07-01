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
            if( (i != 1 && i != 18 && i!= 22 && i!= 25 && i!=35 && i!=54 && i!=52 && i!= 61 && i != 63 && i != 127 && i != 126) ) 
                TransXpedia.ISOMessage[i] = TransXpedia.REQUEST_ISOMESSAGE[i];
        }
		
		TransXpedia.ISOMessage[39]  		= appConfig.RESPONSECODE;

		if(TransXpedia.ISOMessage[0] == '0200')
			TransXpedia.ISOMessage[0]  = '0210';
		else 
			TransXpedia.ISOMessage[0]  = '0430';

		if(TransXpedia.REQUEST_TYPE != 'GREEN PIN' && TransXpedia.REQUEST_TYPE != 'OVERDRAFT') {

			if(TransXpedia.REQUEST_ISOMESSAGE[104])
				TransXpedia.ISOMessage[104]		= TransXpedia.REQUEST_ISOMESSAGE[104] +'0015008Sreedevi063012834011025605';
				
			if( TransXpedia.REQUEST_TYPE != 'MS' && TransXpedia.ISOMessage[0]  == '0430' )	
				TransXpedia.ISOMessage[54] 		= Util.BALANCE;
			
			TransXpedia.ISOMessage[102]			= '12345678901234';

		}
		
		if(TransXpedia.REQUEST_TYPE == 'GREEN PIN') {
			TransXpedia.ISOMessage[104] = '';
		}

		if(TransXpedia.REQUEST_TYPE == 'OVERDRAFT') {
			TransXpedia.ISOMessage[104] = '0010081700000100100817000002003009Bangalore047012000000100000064001' + appConfig.OVERDRAFT.AVAILABILITY.slice(-1);
			TransXpedia.ISOMessage[102]	= '12345678901234';
		}

		if( TransXpedia.REQUEST_TYPE == 'MS')    
			  TransXpedia.ISOMessage[120] 	= Util.MINISTATEMENT;
			  
		TransXpedia.ISOMessage[125] 	    = TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,6) + '|' + 
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

			if (TransXpedia.REQUEST_ISOMESSAGE[3] == '010000')
				TransXpedia.REQUEST_TYPE = 'WITHDRAWAL';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='310000')
				TransXpedia.REQUEST_TYPE = 'BE';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.REQUEST_ISOMESSAGE[120].indexOf('07')== 6)
				TransXpedia.REQUEST_TYPE = 'MS';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='OT0000')
				TransXpedia.REQUEST_TYPE = 'GREEN PIN';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='OV0000')
				TransXpedia.REQUEST_TYPE = 'GREEN PIN';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='PG0000')
				TransXpedia.REQUEST_TYPE = 'GRREN PIN';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='OI0000' || TransXpedia.REQUEST_ISOMESSAGE[3] =='OC0000')
				TransXpedia.REQUEST_TYPE = 'OVERDRAFT';
			else {
				return rejected(`INVALID REQUEST TO PIN CHANNEL :: REQUEST[${appConfig.REQUEST_ISOMESSAGE[3]}]`);
			}
							
			return resolved(TransXpedia);

		}catch(e) {
			return rejected(e); 
		}

	});
}
/* ************************************** */

