module.exports = {
	iTGS : {
		AEPS 		: require('./iTGS/AEPSChannel'),
		AE   		: require('./iTGS/AEChannel'),
		IFIS 		: require('./iTGS/IFISChannel'),
		IMPS 		: require('./iTGS/IMPSChannel'),
		SHG  		: require('./iTGS/SHGChannel'),
		PIN  		: require('./iTGS/PINChannel'),
		KEYEXCHANGE : require('./iTGS/KEChannel'),
		TPD			: require('./iTGS/TPDChannel'),
		LOAN		: require('./iTGS/LoanChannel')	
	},
	ALIVE : {
		TXN 		: require('./ALIVE/TXNChannel'),
		RD   		: require('./ALIVE/RDChannel'),
		SHG 		: require('./ALIVE/SHGChannel'),
		SEEDING		: require('./ALIVE/SEEDINGChannel'),
		AGENTLOGIN	: require('./ALIVE/AGENTLOGINChannel')
	}

}
