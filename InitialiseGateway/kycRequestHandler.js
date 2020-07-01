/* ********************************************************************* */
const fs 			= require('fs');
const kycservices   = require('../Kycservices/kycservices');
const appConfig		= require('../config')
/* ********************************************************************* */

appConfig.KYCGATEWAYNAME = appConfig.KYCGATEWAY[`${appConfig.GATEWAYNAME}`].toUpperCase();


/* ********************************************************************* */
module.exports = function kycRequestHandler(_ClientRequest, _ClientResponse) {
	var chunk = '';
	_ClientRequest.on('data', (_ClientData) => {
			chunk += _ClientData;
	});
	 
	_ClientRequest.on('error', (e) => {
			console.log('ERROR WHILE READING CLIENT REQUEST');
			_ClientRequest.destroy();
	});

	_ClientRequest.on('end', ()=> {
			
			kycservices[`${appConfig.KYCGATEWAYNAME}`](_ClientRequest, _ClientResponse, chunk);
	});

}
/* ********************************************************************* */

