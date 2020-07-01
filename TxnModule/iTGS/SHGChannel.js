
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

		  		if ( (TransXpedia.REQUEST_TYPE == 'AE' || TransXpedia.REQUEST_TYPE == 'SF')	&& ( i == 18 || i== 22 || i== 25 )) 
                	TransXpedia.ISOMessage[i]       = TransXpedia.REQUEST_ISOMESSAGE[i];
           		else if((i != 1  && i != 18 && i!= 22 && i!= 25 &&  i != 126 && i != 127) && !(i >= 111 && i <= 119) && !(i >= 121 && i <= 123) ) 
                	TransXpedia.ISOMessage[i]       = TransXpedia.REQUEST_ISOMESSAGE[i];
            }

			if(TransXpedia.ISOMessage[0] == '0200') 	
				TransXpedia.ISOMessage[0]  = '0210';
			else 
				TransXpedia.ISOMessage[0]  = '0430';

       		TransXpedia.ISOMessage[39]  = appConfig.RESPONSECODE;

		
			if (TransXpedia.REQUEST_TYPE == 'AE') {
				TransXpedia.ISOMessage[104] = '593060172286|Satya|A|Adimulam|192873645|593060172287|Amit|A|Agarwal|5678943210|579042165544|Sreedevi|M|N|1789890037';
				TransXpedia.ISOMessage[102] = 'Sri Manjunatha|776655442211';
			} else if( TransXpedia.REQUEST_TYPE == 'SF'){
				TransXpedia.ISOMessage[102] = 'Sri Manjunatha|776655442211';
				TransXpedia.ISOMessage[120] = '002003SHG03901177711112222040005satya04101188833334444042004Amit04301199955556666044005ullas080012112233887766'
			} else {
        		TransXpedia.ISOMessage[62]  = Util.AUTHCODE;

				if(TransXpedia.REQUEST_TYPE != 'BIOAUTH' && TransXpedia.REQUEST_TYPE != 'BIOAUTH-V3' && TransXpedia.REQUEST_TYPE != 'BAV' && TransXpedia.REQUEST_TYPE != 'MS') {
        			TransXpedia.ISOMessage[54] = Util.BALANCE;
					if(TransXpedia.ISOMessage[104] != undefined)
						TransXpedia.ISOMessage[104] = TransXpedia.ISOMessage[104] + '015009venkatesh';
				}

				if(TransXpedia.REQUEST_TYPE == 'BAV' || TransXpedia.REQUEST_TYPE == 'CDA') {
					TransXpedia.ISOMessage[38] = 'UNI000';
					if(TransXpedia.ISOMessage[104] != undefined)
						TransXpedia.ISOMessage[104] = TransXpedia.ISOMessage[104] + '015009venkatesh';
				}


				if( TransXpedia.REQUEST_TYPE == 'MS') {
					TransXpedia.ISOMessage[120]	= Util.MINISTATEMENT;
				if(TransXpedia.ISOMessage[104] != undefined)
					TransXpedia.ISOMessage[104] = TransXpedia.ISOMessage[104] + '015009venkatesh'
				}
			}

			TransXpedia.ISOMessage[125]   = TransXpedia.REQUEST_ISOMESSAGE[37].slice(0,6) + '|' +
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
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.REQUEST_ISOMESSAGE[120].indexOf('45')== 6)
				TransXpedia.REQUEST_TYPE = 'FT';
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] =='400000')
				TransXpedia.REQUEST_TYPE = 'FT';
			else if (TransXpedia.REQUEST_ISOMESSAGE[3] =='900000' && TransXpedia.ROUTINGKEY == 11)
				TransXpedia.REQUEST_TYPE = 'MS';
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] =='AE0000')
				TransXpedia.REQUEST_TYPE = 'AE';								
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] =='100000')
				TransXpedia.REQUEST_TYPE = 'BIOAUTH';	
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] == '350000')
				TransXpedia.REQUEST_TYPE = 'SF';	
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] == '310001' || TransXpedia.REQUEST_ISOMESSAGE[3] == '900001' || TransXpedia.REQUEST_ISOMESSAGE[3] == '360000' || TransXpedia.REQUEST_ISOMESSAGE[3] == '390000')
				TransXpedia.REQUEST_TYPE = 'BIOAUTH-V3';
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] == '370000')
				TransXpedia.REQUEST_TYPE = 'BAV';	
			else if(TransXpedia.REQUEST_ISOMESSAGE[3] == '230000')
				TransXpedia.REQUEST_TYPE = 'CDA';
			else {
				return rejected(`INVALID REQUEST TO SHG CHANNEL ::: REQUEST TYPE[${TransXpedia.REQUEST_ISOMESSAGE[3]}]`);
			}	

			return resolved(TransXpedia);

		}catch(e) {
			return rejected(e); 
		}

	});
}
/* ************************************** */
