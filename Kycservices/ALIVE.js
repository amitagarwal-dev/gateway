/* ********************************************************************* */
const fs		= require('fs');
/* ********************************************************************* */


/* ********************************************************************* */
const WebServices = {'/alivekyc/otp' 	 		   : ProcessOTPrequest, 
					 '/alivekyc/ekyc' 		  	   : ProcessKYCRequest,
					 '/alivekyc/aadhaarlinkstatus' : ProcessAadharLinkingStatus,
					}
/* ********************************************************************* */


/* ********************************************************************* */
module.exports = function(_ClientRequest, _ClientResponse, ClientData) {
	var WebServicefunction = undefined;

    WebServicefunction = WebServices[`${_ClientRequest.url}`];

	switch(_ClientRequest.method)
	{ 
		case 'POST' : {
					  if(WebServicefunction == undefined) {
                        
                        _ClientResponse.writeHead(404, { 'Content-Type': 'text/JSON' });
                        _ClientResponse.write("Web service not found");
						_ClientResponse.end();
						console.log("Web Service not found", _ClientRequest.url);

					   }
    					else {
						    WebServicefunction(_ClientRequest, _ClientResponse, ClientData);
					   }
		             }
				     break;
		case 'GET' : {
						_ClientResponse.writeHead(404, { 'Content-Type': 'text/JSON' });
						_ClientResponse.write("{Error : `Web Service Not Found` }");
						_ClientResponse.end();
						console.log("Web Service not found", _ClientRequest.url);
					}
					break;

		default : {
					_ClientResponse.writeHead(404, { 'Content-Type': 'text/JSON' });
					_ClientResponse.write({Error : `Web Service Not Found` });
					_ClientResponse.end();
					console.log("Wed Service not found", _ClientRequest.url);
		           }
	}
}
/* ********************************************************************* */


/* ********************************************************************* */
function ProcessOTPrequest(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n----------------- ALIVE REQUEST FROM iPOS -------------------\n');
	console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/ALIVE/OTP.failed';
	else
		filename = './Kycservices/RespFiles/ALIVE/OTP.success';

	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResponse.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResponse.write("{Error : `Alive kyc internal Error` }");
				_ClientResponse.end();
				console.log("Alive kyc internal error", e);
			}
			else {
        		_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n-------------------- ALIVE OTP RESPONSE TO iPOS -------------------\n');
        		console.log(data.toString());
			}
	});
}


function ProcessKYCRequest(_ClientReq, _ClientResp, _ClientData)
{

	console.log('\n----------------- ALIVE EKYC REQUEST FROM iPOS -------------------\n');
	console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		 filename = './Kycservices/RespFiles/ALIVE/Ekyc.failed';
	else
		filename = './Kycservices/RespFiles/ALIVE/Ekyc.success';

	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResponse.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResponse.write("{Error : `Alive kyc internal Error` }");
				_ClientResponse.end();
				console.log("Internal Error in BioAuth : ", e);
			}
			else {
			  
				_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n-------------------- ALIVE EKYC RESPONSE TO iPOS -------------------\n');
        		console.log(data.toString());
			}
	});
}

				
function ProcessAadharLinkingStatus(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n-------------- ALIVE AADHAR LINKING STATUS REQUEST FROM iPOS ------------------\n');
	console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/ALIVE/AadharLinkStatus.failed';
	else
		filename = './Kycservices/RespFiles/ALIVE/AadharLinkStatus.success';

	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResponse.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResponse.write("{Error : `iASK Internal Error` }");
				_ClientResponse.end();
				console.log("Internal Error in Aadhar Linking Status : ", e);
			}
			else {
        		_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n------------- AADHAR LINKING STATUS RESPONSE TO iPOS -------------\n');
        		console.log(data.toString());
			}
	});
}
/***************************************************************************************/
