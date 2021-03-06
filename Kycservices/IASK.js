/* ********************************************************************* */
const appConfig = require('../config')
const fs		= require('fs');
/* ********************************************************************* */


/* ********************************************************************* */
const WebServices = {'/iask/otp' 	 		  	   : ProcessOTPrequest,
					 '/iask/ekyc'				   : ProcessKYCRequest,
					 '/iask/bio_auth' 		  	   : ProcessBioAuthRequest,
					 '/iask/aadhaarlinkstatus' 	   : ProcessAadharLinkingStatus,
					 '/iask/getrefno'	   : ProcessAadhaarValutRefno,
					 '/iask/getaadhaarno'  : ProcessAadhaarValutAadhaarNo
					}
/* ********************************************************************* */


/* ********************************************************************* */
module.exports = function (_ClientRequest, _ClientResponse, ClientData) {
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

function ProcessOTPrequest(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n--------------------- OTP REQUEST FROM iPOS ---------------------\n');

    console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/IASK/OTP.failed';
	else
		filename = './Kycservices/RespFiles/IASK/OTP.success';


	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResp.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResp.write("{'Error' : 'iASK Internal Error' }");
				_ClientResp.end();
				console.log("Internal Error in OTP : ", e);
			}
			else {
        		_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n----------------------- OTP RESPONSE TO iPOS --------------------\n');
        		console.log(data.toString());
			}
	});
}

function ProcessKYCRequest(_ClientReq, _ClientResp, _ClientData)
{

	console.log('\n----------------- EKYC REQUEST FROM iPOS -------------------\n');
	console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/IASK/Ekyc.failed';
	else
		filename = './Kycservices/RespFiles/IASK/Ekyc.success';

	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResp.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResp.write("{Error : `iask kyc internal Error` }");
				_ClientResp.end();
				console.log("Internal Error in ekyc : ", e);
			}
			else {
			  
				_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n-------------------- EKYC RESPONSE TO iPOS -------------------\n');
        		console.log(data.toString());
			}
	});
}

function ProcessBioAuthRequest(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n----------------- BIO-AUTH REQUEST FROM iPOS -------------------\n');
    
    console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/IASK/BioAuth.failed';
	else
		filename = './Kycservices/RespFiles/IASK/BioAuth.success';


	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResp.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResp.write("{Error : `iASK internal Error` }");
				_ClientResp.end();
				console.log("Internal Error in BioAuth : ", e);
			}
			else {
        		_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n-------------------- BIO-AUTH RESPONSE TO iPOS -------------------\n');
        		console.log(data.toString());
			}
	});
}

function ProcessAadharLinkingStatus(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n-------------- AADHAR LINKING STATUS REQUEST FROM iPOS ------------------\n');

    console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/IASK/AadharLinkStatus.failed';
	else
		filename = './Kycservices/RespFiles/IASK/AadharLinkStatus.success';


	fs.readFile(filename, (e, data) => {
			if(e) {
				ClientResp.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResp.write("{Error : `iASK Internal Error` }");
				_ClientResp.end();
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

function ProcessAadhaarValutRefno(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n-------------- AADHARVALUT GET REFERENCE NUMBER REQUEST FROM iPOS ------------------\n');

	console.log("Data Recieved : ", _ClientData.toString());
	var inputData = JSON.parse(_ClientData);

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/IASK/Aadhaarvalutref.failed';
	else
		filename = './Kycservices/RespFiles/IASK/Aadhaarvalutref.sucess';


	var refNo = inputData.aadhaarNo + '-abcdefgh';

	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResp.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResp.write("{Error : `AadhaarValut Internal Error` }");
				_ClientResp.end();
				console.log("Internal Error in Aadhar Valut Status : ", e);
			}
			else {

				if(appConfig.RESPONSECODE == '00') {
					var filedata = JSON.parse(fs.readFileSync('./AadhaarValut.json'));
					filedata[refNo] =  inputData.aadhaarNo;
					fs.writeFileSync('./AadhaarValut.json', JSON.stringify(filedata));

					data = JSON.parse(data);
					data.aadhaarvalutrefNo = refNo;
					data = Buffer.from(JSON.stringify(data));
				}
				
        		_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n------------- AADHARVALUT GET REFERENCE NUMBER RESPONSE TO iPOS -------------\n');
        		console.log(data.toString());
			}
	});
}

function ProcessAadhaarValutAadhaarNo(_ClientReq, _ClientResp, _ClientData) {

	console.log('\n-------------- AADHARVALUT GET AADHAAR NUMBER REQUEST FROM iPOS ------------------\n');

    console.log("Data Recieved : ", _ClientData.toString());

	let filename = '';

	if(appConfig.RESPONSECODE != '00')
		filename = './Kycservices/RespFiles/IASK/AadharvalutaadhaarNo.failed';
	else
		filename = './Kycservices/RespFiles/IASK/AadharvalutaadhaarNo.sucess';

	var inputData = JSON.parse(_ClientData);

	var aadhaarRefno = inputData.aadhaarvalutrefNo;

	fs.readFile(filename, (e, data) => {
			if(e) {
				_ClientResp.writeHead(500, { 'Content-Type': 'text/JSON' });
				_ClientResp.write("{Error : `Aadhaar Valut Internal Error` }");
				_ClientResp.end();
				console.log("Internal Error in Aadhar Valut Status : ", e);
			}
			else {
				
				if(appConfig.RESPONSECODE == '00') {
					var filedata = JSON.parse(fs.readFileSync('./AadhaarValut.json'));
					var aadhaarNo = filedata[aadhaarRefno];

					data = JSON.parse(data);
					data.aadhaarNo = aadhaarNo;
					data = Buffer.from(JSON.stringify(data));
				}

        		_ClientResp.writeHead(200, {'Content-Type': 'text/plain'});
        		_ClientResp.write(data);
        		_ClientResp.end();
				console.log('\n------------- AADHARVALUT GET AADHAARNO  RESPONSE TO iPOS -------------\n');
        		console.log(data.toString());
			}
	});
}


