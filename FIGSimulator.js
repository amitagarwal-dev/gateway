/* ************************************************ */
const initGateway = require('./InitialiseGateway/initGateway').initGateway;
const appConfig   = require('./config');
/* ************************************************ */

appConfig.count = 0;

/* ************************************************ */
	initGateway()
	.then(()=>{
		appConfig.KYCGATEWAYNAME = appConfig.KYCGATEWAY[`${appConfig.GATEWAYNAME}`];
		
		const CommType    	= require('./Utils/commType')[`${appConfig.GATEWAYNAME}`];
		const KYCommType    = require('./Utils/commType')[`${appConfig.KYCGATEWAYNAME}`];
		
		require(`./InitialiseGateway/CommType/gateway/${CommType}`);
		require(`./InitialiseGateway/CommType/kyc/${KYCommType}`);

	}).catch((e) => {
		console.log(' ################ GATEWAY SIMULATOR INITIALIZATION ERROR #################');
		console.log(e);
		console.log(' #########################################################################');
		process.exit();
	});
/* ************************************************ */
