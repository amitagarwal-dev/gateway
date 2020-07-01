/* *********************************************** */
const ProcessTXN 	= require ('./ProcessTXN');
/* *********************************************** */


/* *********************************************** */
module.exports = function clientRequestHandler (socket) {

	socket.on ('error', (e) => {
		 socket.destroy();
	});

    socket.on('data', (ClientData) => {

	   var fs = require('fs');
	   ProcessTXN (socket, ClientData);
			
    });
     socket.on ('end', () => {
	});

	socket.on ('close', () => {
	})

}
/* *********************************************** */

