/* ************************************************ */
const initGateway = require('./InitialiseGateway/initGateway').initGateway;
const appConfig   = require('./config.js');

/* ************************************************ */

/* ************************************************ */
	initGateway()
	.then(()=>{
		const CommType = require('./Utils/commType')[`${appConfig.GATEWAY}`];
		//const CommType = require('./Utils/commType').ALIVE;
		//const KYCCommType = require('./Utils/commType').KYC;
		const KYCCommType = require('./Utils/commType')[`${appConfig.SERVER}`];

		require(`./GatewayCommType/${CommType}`);
		require(`./GatewayCommType/${KYCCommType}`);

	}).catch((e) => {
		console.log(' ################ GATEWAY SIMULATOR INITIALIZATION ERROR #################');
		console.log(e);
		console.log(' #########################################################################');
		process.exit();
	});
/* ************************************************ */
