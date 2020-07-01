/* ********************************************************************* */
const httpServer      = require('http').createServer();
const appConfig       = require('../../../config');
const requestHandler  = require('../../kycRequestHandler');
/* ********************************************************************* */

/* ********************************************************************* */
httpServer.maxConnections = 300;
httpServer.timeout        = 60*1000;
/* ********************************************************************* */
httpServer.on('request', requestHandler);

httpServer.on('error', (e) => {
		console.log(e);
});

httpServer.on('timeout', (ClientSocket) => {
       ClientSocket.destroy;
        
});

httpServer.on('listening', () => {
    console.log('KYC Simulator Is Listening On IP : %s And PORT : %d :-)', appConfig.SIMULATORIP, appConfig.KYCPORT);
    console.log('+ -----------------------------------------------------------  +');
})

httpServer.listen(appConfig.KYCPORT, appConfig.SIMULATORIP, 300);
/* ********************************************************************* */

