/* **************************************************** */
const appConfig        = require('../config');
const gatewayServices  = require('../Gatewayservices/gatewayServices')
/* **************************************************** */

/* **************************************************** */
module.exports = function(socket, ReqBuffer) {

try {
	let GatewayService = gatewayServices[`${appConfig.GATEWAYNAME}`]
	if(GatewayService == undefined) {
		console.log(' ##################################################### ');
		console.log(' CONFIGURED GATEWAY IS :: ' + appConfig.GATEWAYNAME);
		console.log(' CURRENTLY THIS GATEWAY SIMULATOR NOT SUPPORTED');
		console.log(' ##################################################### ');
		socket.destroy();
	}else { 

	  if(appConfig.count == 0 && appConfig.RESPONSEDELAY > 0) {
		  appConfig.count = appConfig.count + 1;
		  ExpireResponseDelayTime();
	  } 
	  GatewayService(socket, ReqBuffer);
    }
}catch(e) {
	console.log(e);
}
}
/* **************************************************** */

/* **************************************************** */
function ExpireResponseDelayTime() {
	setTimeout(()=>{
		appConfig.RESPONSEDELAY= 0;
		console.log('RESPONSE DELAYTIME GOT EXPIRED! ');
	}, appConfig.DELAYEXPIRETIME * 1000)
}
/* **************************************************** */
