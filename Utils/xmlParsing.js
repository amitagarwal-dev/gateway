/* ********************************************************************** */
const xml2js 	= require('xml2js');
const errModule = require('./error');
const inspect 			= require ('eyes').inspector({maxLength:false});
/* ********************************************************************** */

function parseXMLBufferToJSON (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		try {
			xml2js.parseString (TransXpedia.REQUEST_BUFFER, (e, JsonXML) => {
				if (e) {
					TransXpedia.systemErr   = e;
					TransXpedia.serverError = errModule.E_TXN_MODULE_CREATE;
					TransXpedia.errDescription = `CLIENT ERROR MESSAGE CREATION FAILED [FUNCTION : ${parseXMLBufferToJSON.name}]`;
					return rejected(TransXpedia);
				} else {
					TransXpedia.XML_JSON = JsonXML;
					return resolved(TransXpedia);
				}
			});
		} catch (e) {
			TransXpedia.systemErr   = e;
			TransXpedia.serverError = errModule.E_TXN_MODULE_CREATE;
			TransXpedia.errDescription = `CLIENT ERROR MESSAGE CREATION FAILED [FUNCTION : ${parseXMLBufferToJSON.name}]`;
			return rejected(TransXpedia);
		}
	});
}

function parseJSONToXML (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		try {
			let builder = new xml2js.Builder({
				renderOpts : {'newline':''}
			});
			let xmlBuffer = builder.buildObject(TransXpedia.XML_JSON);
			TransXpedia.RESPONSE_BUFFER = xmlBuffer;
			return resolved(TransXpedia);
		} catch (e) {
			TransXpedia.systemErr   = e;
			TransXpedia.serverError = errModule.E_XML_BUFFER_CREATE;
			TransXpedia.errDescription = `XML BUFFER CREATION FAILED ` + 
				`[FUNCTION : ${parseJSONToXML.name}]`;
			return rejected(TransXpedia);
		}
	});
}

module.exports = {
  parseXMLBufferToJSON : parseXMLBufferToJSON,
  parseJSONToXML : parseJSONToXML
}
