/* *********************************************** */
const appConfig = require('../config');
const fs        = require('fs');
/* *********************************************** */

module.exports.initGateway = function initGateway() {
	return new Promise((resolved, rejected) => {
		try {
			if(process.argv.length != 2) {
				throw 'USAGE : node index.js';
			}

			if(appConfig.GATEWAYNAME.toUpperCase() != 'ITGS' && appConfig.GATEWAYNAME.toUpperCase() != 'ALIVE') {
				throw 'INVALID GATEWAYNAME CONFIGURED :: SUPPORTED GATEWAY TYPES[ITGS],[ALIVE]';
			}

			appConfig.KYCGATEWAYNAME = appConfig.KYCGATEWAY[`${appConfig.GATEWAYNAME}`];

			if(appConfig.KYCGATEWAYNAME.toUpperCase() != 'IASK' && appConfig.KYCGATEWAYNAME.toUpperCase() != 'ALIVEKYC') {
				throw 'INVALID KYC GATEWAYNAME CONFIGURED :: SUPPORTED KYC GATEWAY TYPES[IASK],[ALIVEKYC]';
			}

			if( appConfig.GATEWAYNAME.toUpperCase() == 'ITGS') {
				if(appConfig.RESPONSECODE.length != 2 )
					throw 'CONFIGURED INVALID RESPONSE CODE LENGTH FOR ITGS GATWAY!!! IT SHOULD BE 2 DIGITS';
			}

			if( appConfig.GATEWAYNAME.toUpperCase() == 'ALIVE') {
				if(appConfig.RESPONSECODE.length != 3 )
					throw 'CONFIGURED INVALID RESPONSE CODE LENGTH FOR ALIVE GATWAY!!! IT SHOULD BE 3 DIGITS';
			}

		}catch(e) {
			return rejected(e);
		}

		try {
			var table = require('../Utils/table');

			readlogo()
			.then(table)
			.then(() => {
				return resolved();
	
			}).catch((e) => {
				return rejected(e);
			});

		}catch(e) {
			return rejected(e);
		}
	});

}

function readlogo() {
        return new Promise((resolve,reject)=>{
                fs.readFile('./Utils/logo.js',function (e,data) {
                        if(e) reject(e);
                        else {
                                console.log(data.toString());
                                return resolve();
                        }
                });
        })
}
/* *********************************************** */
