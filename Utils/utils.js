/* ********************************************************************** */
const fs 			= require('fs');
/* ********************************************************************** */

module.exports.w_readFile = function w_readFile(fileName, options) {
  return new Promise ((resolved, rejected) => {
    fs.readFile (fileName, options, (e, data) => {
      if (e) rejected(e);
      resolved(data);
    });
  });
}

module.exports.convertStringToBuffer = function (InputString) {
    var outBuffer = Buffer.alloc(InputString.length/2);
    for (let i =0; i < InputString.length; i += 2) {
      outBuffer[i/2] = (parseInt(InputString[i], '16') << 4) | parseInt(InputString[i+1], 16);
    }
    return outBuffer;
}

const TOKEN_TIME_LIMIT_SEC = 3600*2; 
module.exports.validateToken = function validateToken (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		let value = (parseInt(Date.now()) - TransXpedia.TOKEN_GENTIME)/1000;
		if (value > TOKEN_TIME_LIMIT_SEC) {
			TransXpedia.systemErr   = null;
//			TransXpedia.serverError = errModule.E_TOKEN_VALIDATION;
			TransXpedia.errDescription = `TOKEN EXPIRED [FUNCTION : ${validateToken.name}]`;
			return rejected(TransXpedia);
		} else return resolved(TransXpedia);
	});
}

module.exports.validateMerchantTerminal = function validateMerchantTerminal (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		if (TransXpedia.MERCHANT_TERMINALID != TransXpedia.TERMINAL_DATA) {
			TransXpedia.systemErr   = null;
			TransXpedia.serverError = errModule.E_MERCHANT_TERMINAL_VALIDATION;
			TransXpedia.errDescription = `MERCHANT TO TERMINAL VALIDATION FAILED ` +
				`[FUNCTION : ${validateMerchantTerminal.name}] ` +
				`[MERCHANT_ID : ${TransXpedia.MERCHANT_ID}] ` +
				`[MERCHANT_TERMINALID : ${TransXpedia.MERCHANT_TERMINALID}] ` +
				`[INCOMING TERMINAL ID : ${TransXpedia.TERMINAL_DATA}]`;
			return rejected(TransXpedia);
		} else  {
			return resolved(TransXpedia);
		}
	});
}

module.exports.CreateLoginSessionID = function CreateLoginSessionID(TransXpedia) {
	return new Promise ((resolved, rejected) => {
		TransXpedia.LOGIN_SESSIONID = uuid4();
		TransXpedia.LOGIN_SESSIONID_GEN_TIME = parseInt(Date.now());
		return resolved(TransXpedia);
	});
}

const SESSION_ID_TIME_LIMIT = 3600*6;
module.exports.validateLoginSession = function validateLoginSession (TransXpedia) {
	return new Promise ((resolved, rejected) => {
		let value = (parseInt(Date.now()) - TransXpedia.LOGIN_SESSIONID_GEN_TIME)/1000;
		if (value > SESSION_ID_TIME_LIMIT) {
			TransXpedia.systemErr   = null;
//			TransXpedia.serverError = errModule.E_SESSION_ID_EXPIRE;
			TransXpedia.errDescription = `SESSION ID EXPIRED [FUNCTION : ${validateLoginSession.name}]`;
			return rejected(TransXpedia);
		} else return resolved(TransXpedia);
	});
}

module.exports.saveToFile = function saveToFile (DirectoryPath, filename, content) {
	return new Promise ((resolved, rejected) => {                                             
		const backupPath = getDirectoryName(DirectoryPath);                                    
		mkdirp(backupPath, function (e) {                                                      
			if(e) return rejected(e);                                                           
			fs.writeFile(`${backupPath}/${filename}`, Buffer.from(content, 'utf-8'), (e) => {   
				if (e) return rejected(e);                                                       
				return resolved();                                                               
			});                                                                                 
		});                                                                                    
	});                                                                                       
}                                                                                            

module.exports.appendToFile = function appendToFile(DirectoryPath, filename, content) {
	return new Promise ((resolved, rejected) => {                                             
		let backupPath 	= '';
		let messageToSave = '';
		try {
			backupPath = getDirectoryName(DirectoryPath);                                    
			messageToSave = Buffer.concat([Buffer.from(content, 'utf-8'), Buffer.from([0x0a, 0x0a])]);
		} catch(e) {
			return rejected(e)
		}
		mkdirp(backupPath, function (e) {                                                      
			if(e) return rejected(e);                                                           
			fs.appendFile(`${backupPath}/${filename}`, messageToSave, (e) => {   
				if (e) return rejected(e);                                                       
				return resolved();                                                               
			});                                                                                 
		});                                                                                    
	});                                                                                       
}                                                                                            

function getDirectoryName(InitialPath) {
	const date  = new Date();                                                                 
	const year  = date.getFullYear();                                                         
	const month = date.getMonth() + 1;                                                        

	return `${InitialPath}${year}/${month}/`;                                                 
}                                                                                            

module.exports.generateUUID = function generateUUID() {
	return uuid4();
}

module.exports.hexStringToHex = function hexStringToHex(TransXpedia){
	return new Promise((resolved,rejected) =>{
		try{
			let arrOfHex = [];
			let arrofValue = [];
			for(let i=0;i<TransXpedia.HEXSTRING.length;i++){
				arrOfHex.push(parseInt(TransXpedia.HEXSTRING[i],'16'));
			}
			for (i=0;i<arrOfHex.length;i++){
				arrofValue.push(((arrOfHex[i]<<4) & 0xf0)|((arrOfHex[++i]) & 0x0f));
			}
			TransXpedia.NUMERICHEX=arrofValue;
			return resolved(TransXpedia);

		}catch(e){
			TransXpedia.systemErr               = e;
//			TransXpedia.serverError             = errModule.E_HEXSTRING_TO_HEX;//not included in error.js
			TransXpedia.errDescription          = `HEXSTRING TO HEX CONVERSION FAILED [FUNCTION : hexStringToHex] [HEXSTRING : ${TransXpedia.HEXSTRING}]`   
				return rejected(TransXpedia);
		}
	})
}


module.exports.parseJSON = function parseJSON(TransXpedia){
	return new Promise((resolved, rejected) => {
		try {
			//TransXpedia.JSON = JSON.parse(TransXpedia.PLAIN_BUFFER);
			TransXpedia.JSON = JSON.parse(TransXpedia.RESPONSE_ISOMESSAGE);
			return resolved(TransXpedia);
		} catch(e) {
			TransXpedia.systemErr 		= e;
//			TransXpedia.serverError    = errModule.E_JSON_PARSE;                              
			TransXpedia.errDescription = `UNABLE TO CONVERT MESSAGE INTO JSON OBJECT `;
			console.log("UNABLE TO CONVERT MESSAGE INTO JSON OBJECT");
			return rejected(TransXpedia);
		}
	});
}

module.exports.parseTLV = function(inputString) {
	try{
	tlv = {}; breakCounter = 0; BREAK_LIMIT = 16;
	let tag = undefined, length = undefined, value = undefined;

	while (inputString.length != 0) {
		tag     = inputString.slice(0,3) 
		length  = parseInt(inputString.slice(3,6))
		value   = inputString.slice(6, 6+length)
		inputString  = inputString.slice(6+length);
		breakCounter++;
		if (breakCounter > BREAK_LIMIT) break;
		tlv[tag] = value;
	}

	return tlv;
	}catch(e){
		return undefined;
	}
}

module.exports.maskAadhaarNumber = function maskAadhaarNumber(plainAadhaar){
	try{
		if(plainAadhaar == '' || plainAadhaar == undefined){
			return undefined;
		}
		else{
			let maskingSymbol = "XXXXXXXXXXXX";
			maskingSymbol = (maskingSymbol + plainAadhaar.slice(-4)).slice(-12);
			return maskingSymbol;
		}
	}catch(e){
		return undefined;
	}
}

module.exports.maskAccountNumber = function maskAccountNumber(plainAccountNumber){
	try{
		if(plainAccountNumber == '' || plainAccountNumber == undefined){
			return undefined;
		}
		else{
			let maskingSymbol = "XXXXXXXXXXXXX";
			maskingSymbol = (maskingSymbol + plainAccountNumber.slice(-4)).slice(-13);
			return maskingSymbol;
		}
	}catch(e){
		return undefined;
	}
}

module.exports.maskCardNumber = function maskCardNumber(plainCardNumber){
	try{
		if(plainCardNumber == '' || plainCardNumber == undefined){
			return undefined;
		}
		else{
			let maskingSymbol = "XXXXXXXXXXXXXXXX";
			maskingSymbol = (maskingSymbol + plainCardNumber.slice(-4)).slice(-16);
			return maskingSymbol;
		}
	}catch(e){
		return undefined;
	}
}

module.exports.mask = function maskCardNumber(plainCardNumber){
        try{
                if(plainCardNumber == '' || plainCardNumber == undefined){
                        return undefined;
                }
                else{
                        let maskingSymbol = "XXXXXXXXXXXXXXXX";
                        maskingSymbol = (maskingSymbol + plainCardNumber.slice(-4)).slice(-plainCardNumber.length);
                        return maskingSymbol;
                }
        }catch(e){
                return undefined;
        }
}
module.exports.consoleDebugData = function consoleDebugData(TransXpedia){
        try{
                let service             = TransXpedia.SERVICE;
                let UUID                = TransXpedia.UUID;
                let clientBuffer        = TransXpedia.ClientBuffer;
                let plainBuffer         = TransXpedia.PLAIN_BUFFER;
                let clientIp            = TransXpedia.CLIENT_IP;
                let clientPort          = TransXpedia.CLIENT_PORT;
                let tokenUUID           = TransXpedia.TOKEN_UUID;
                let plainBufferInJson   = TransXpedia.JSON;
                let clientJson          = TransXpedia.CLIENT_JSON;
                let serverModule        = TransXpedia.SERVER_MODULE;
                let systemError         = TransXpedia.systemErr;    
                let serverError         = TransXpedia.serverError;
                let errDescription      = TransXpedia.errDescription;

                console.log("                                          ");
                console.log("                                          ");
                console.log("                                          ");
                console.log("                                          ");
                console.log("*************:-REQUEST DATA-:*************");
                console.log("SERVICE: ",service);
                console.log("UUID: ",UUID);
                console.log("clientIp: ",clientIp);
                console.log("clientPort: ",clientPort);
                console.log("tokenUUID: ",tokenUUID);
                console.log("##########################################");
                console.log("                                          ");
                console.log("----------------< ERROR >-----------------");
                console.log("                                          ");
                console.log("SYSTEM ERROR : ",systemError);
                console.log("SERVER ERROR : ",serverError);
                console.log("ERROR DESCRIPTION : ",errDescription);
                console.log("SERVER MODULE : ",serverModule);
                console.log("##########################################");
                console.log("                                          ");
                console.log("--------< RECEIVED CLIENT BUFFER >--------");
                console.log("                                          ");
                console.log(clientBuffer);
                console.log("                                          ");
                console.log("##########################################");
                console.log("                                          ");
                console.log("----< AFTER DECRYPTING CLIENT BUFFER >----");
                console.log("                                          ");
                console.log(plainBuffer);
                console.log("                                          ");
                console.log("##########################################");
                console.log("                                          ");
                console.log("-----< PLAIN CLIENT BUFFER IN JSON >------");
                console.log("                                          ");
                console.log(plainBufferInJson);
                console.log("                                          ");
                console.log("##########################################");
                console.log("                                          ");
                console.log("-----------< META CLIENT JSON >-----------");
                console.log("                                          ");
                console.log(clientJson);
                console.log("                                          ");
                console.log("*************:-DEBUG DONE-:***************");
                console.log("                                          ");
                console.log("                                          ");

                return;
        }catch(e){
                console.log("##########################################");
                console.log("                                          ");
                console.log("ERROR IN DEBUGGING FUNCTION", e);
                console.log("                                          ");
                console.log("*************:-DEBUG DONE-:***************");
                return;
        }
}

module.exports.saveMetrics = function saveMetrics(TransXpedia){
	try{
		let ErrCode = TransXpedia.serverError ? TransXpedia.serverError.errorCode.toString() : JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE;
		let ErrString = TransXpedia.serverError ? TransXpedia.serverError.errString : JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORMSG;
		let lengthOfArr = serverVariable.ErrorCounts.length;
		
		if(lengthOfArr == 0){
			serverVariable.ErrorCounts.push({"ErrorCode" : ErrCode, "Count" : 1, "ErrorString" : ErrString});
		}
		else{
			for(let i = 0; i < lengthOfArr; i++){
				if(serverVariable.ErrorCounts[i].ErrorCode == ErrCode){
					serverVariable.ErrorCounts[i].Count += 1;
					break;
				}
				if((i+1) == lengthOfArr){
					serverVariable.ErrorCounts.push({"ErrorCode" : ErrCode, "Count" : 1, "ErrorString" : ErrString});
					break;
				} 
			}
		}
				
				
		switch (TransXpedia.SERVICE)
		{
			case 'AEPS WITHDRAWAL V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.AEPS.Withdrawal.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.AEPS.Withdrawal.V2_5.Failure += 1;
				}
				break;		
			case 'AEPS MINISTATEMENT V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.AEPS.MiniStatement.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.AEPS.MiniStatement.V2_5.Failure += 1;
				}
				break;		
			case 'AEPS FUNDTRANSFER V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.AEPS.FundTransfer.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.AEPS.FundTransfer.V2_5.Failure += 1;
				}
				break;		
			case 'AEPS DEPOSIT V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.AEPS.Deposit.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.AEPS.Deposit.V2_5.Failure += 1;
				}
				break;		
			case 'AEPS BALANCE ENQUIRY V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.AEPS.BalanceEnquiry.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.AEPS.BalanceEnquiry.V2_5.Failure += 1;
				}
				break;		
			case 'DUAL SHG WITHDRAWAL-V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.DUALSHG.Withdrawal.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.DUALSHG.Withdrawal.V2_5.Failure += 1;
				}
				break;		
			case 'DUAL SHG MINISTATEMENT-V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.DUALSHG.MiniStatement.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.DUALSHG.MiniStatement.V2_5.Failure += 1;
				}
				break;		
			case 'DUAL SHG FUNDTRANSFER-V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.DUALSHG.FundTransfer.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.DUALSHG.FundTransfer.V2_5.Failure += 1;
				}
				break;		
			case 'DUAL SHG BALANCE-ENQUIRY-V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.DUALSHG.BalanceEnquiry.V2_5.Success += 1;
				}
				else{
					serverVariable.TxnCounts.DUALSHG.BalanceEnquiry.V2_5.Failure += 1;
				}
				break;		
			case 'TPD AUTH DEPOSIT V2':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.TPD.Deposit.Success += 1;
				}
				else{
					serverVariable.TxnCounts.TPD.Deposit.Failure += 1;
				}
				break;		
			case 'RUPAY WITHDRAWAL':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.RUPAY.Withdrawal.Success += 1;
				}
				else{
					serverVariable.TxnCounts.RUPAY.Withdrawal.Failure += 1;
				}
				break;		
			case 'RUPAY MINISTATEMENT':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.RUPAY.MiniStatement.Success += 1;
				}
				else{
					serverVariable.TxnCounts.RUPAY.MiniStatement.Failure += 1;
				}
				break;		
			case 'RUPAY DEPOSIT':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.RUPAY.Deposit.Success += 1;
				}
				else{
					serverVariable.TxnCounts.RUPAY.Deposit.Failure += 1;
				}
				break;		
			case 'RUPAY BALANCE ENQUIRY':
				if(JSON.parse(TransXpedia.PLAIN_BUFFER).ERRORCODE == '00'){
					serverVariable.TxnCounts.RUPAY.BalanceEnquiry.Success += 1;
				}
				else{
					serverVariable.TxnCounts.RUPAY.BalanceEnquiry.Failure += 1;
				}
				break;		
			default:
				return;
		}
	}catch(e){
		console.log("ERROR IN SAVE METRICS",e);
	}
}
