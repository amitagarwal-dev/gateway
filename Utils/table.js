/* *************************************************************************** */
const fs 		 	= require('fs');
const url 			= require('url');
const util 	  	    = require('util');
const appConfig     = require('../config');
const commType		= require('./commType')
/* *************************************************************************** */

/* *************************************************************************** */
const LINE_LIMIT = 30;
/* *************************************************************************** */

const Webfunctions = { IASK     : ['otp', 'ekyc', 'bio_auth', 'aadhaarlinkstatus' ],
					   ALIVEKYC : ['otp', 'ekyc', 'aadhaarkinkstatus'] };

/* *************************************************************************** */
function displaySupportedWebservices() {
	
	let kycgateway = appConfig.KYCGATEWAY[`${appConfig.GATEWAYNAME}`];
	let services = Webfunctions[`${kycgateway}`];


	for(i in services) {
		weburl = commType[`${kycgateway}`].toLowerCase() + `://${appConfig.SIMULATORIP}:${appConfig.KYCPORT}/` + kycgateway.toLowerCase() + '/' + services[i]; 		
		console.log('|                              |                              |');	
		addRow(services[i].toUpperCase(), weburl);
	    console.log('|______________________________|______________________________|');

	}	
}
/****************************************************************************** */
module.exports = function display() {

	console.log('+ ------------- GATEWAY SIMULATOR CONFIGURATION ------------  +');
	console.log(' _____________________________________________________________ ');
	console.log('|                              |                              |');
	addRow("Gateway Name",	appConfig.GATEWAYNAME);
	console.log('|______________________________|______________________________|');
	addRow('Gateway Listening IP',	appConfig.SIMULATORIP);
	console.log('|______________________________|______________________________|');
	addRow('Gateway Listening Port',	appConfig.PORT);
	console.log('|______________________________|______________________________|');
	addRow('Response Code',	appConfig.RESPONSECODE);
	console.log('|______________________________|______________________________|');
	addRow('Response Delay Time(seconds)',	appConfig.RESPONSEDELAY);
	console.log('|______________________________|______________________________|');
	console.log('                                                               ');
	console.log('+ -------------- KYC SIMULATOR CONFIGURATION ---------------  +');
	console.log(' _____________________________________________________________ ');
	console.log('|                              |                              |');
	addRow("KYC Gateway Name",	appConfig.KYCGATEWAY[`${appConfig.GATEWAYNAME}`]);
	console.log('|______________________________|______________________________|');
	addRow("KYC Server IP",	appConfig.SIMULATORIP);
	console.log('|______________________________|______________________________|');
	addRow('Listening Port',	appConfig.KYCPORT);
	console.log('|______________________________|______________________________|');
	console.log('                                                               ');
	console.log('+ -------------- KYC SUPPORTED WEB SERVICES ----------------- +');
	console.log(' _____________________________________________________________ ');
	displaySupportedWebservices(); 
	console.log('                                                               ');
	console.log('+ -----------------------------------------------------------  +');
}

function addRow(column, value) {
	if (typeof value != 'string') value = value + '';
	let LineCount = 0;
	if (column.length > value.length) {
		LineCount = column.length/LINE_LIMIT;
	} else {
		LineCount = value.length/LINE_LIMIT;
	}

	for(i = 0; i < LineCount; i++) {
		padColumn = column.slice(LINE_LIMIT*i, LINE_LIMIT*(i+1)) + '                              '; 
		padColumn = padColumn.slice(0,30);
		padValue  = value.slice(LINE_LIMIT*i, LINE_LIMIT*(i+1))  + '                              '; 
		padValue  = padValue.slice(0,30);
		console.log('|' + padColumn + '|' + padValue + '|');
	}
}
/* *************************************************************************** */
