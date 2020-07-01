/*********************************************************** */
const clientRequestHandler  = require ('../../clientRequestHandler');
const appConfig             = require('../../../config');
const Server                = require('net').createServer();    
/************************************************************ */


/************************************************************ */
Server.on('connection', clientRequestHandler);

Server.listen(appConfig.PORT, appConfig.SIMULATORIP, () => {
    console.log('TCP Simulator Is Listening On IP : %s And PORT : %d :-)', appConfig.SIMULATORIP, appConfig.PORT);
    console.log('+ -----------------------------------------------------------  +');

});
/************************************************************ */
