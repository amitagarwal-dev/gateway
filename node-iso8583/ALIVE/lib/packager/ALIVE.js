exports.packager = {
	HeaderLength: 2,
	BitmapType:   'binary',
	'0': {
		length: 4,
		name: 'Message Type Indicator',
		type: 'n'
	},
	'1': {
		length: 16,
		name: 'Bitmap',
		type: 'b'
	},
	'2': {
		length: 19,
		name: 'Primary Account Number',
		type: 'lln'
	},
	'3': {
		length: 6,
		name: 'Processing Code',
		type: 'n'
	},
	'4': {
		length: 12,
		name: 'Amount, Transaction',
		type: 'n'
	},
	'5': {
		length: 12,
		name: 'Amount, Settlement',
		type: 'n'
	},
	'6': {
		length: 12,
		name: 'Amount, Cardholder Billing',
		type: 'n'
	},
	'7': {
		length: 10,
		name: 'Transmission Date and Time',
		type: 'n'
	},
	'8': {
		length: 8,
		name: 'Amount, Cardholder Billing Fee',
		type: 'n'
	},
	'9': {
		length: 8,
		name: 'Conversion Rate, Settlement',
		type: 'n'
	},
	'10': {
		length: 8,
		name: 'Conversion Rate, Cardholder Billing',
		type: 'n'
	},
	'11': {
		length: 6,
		name: 'System Trace Audit Number',
		type: 'n'
	},
	'12': {
		length: 12,
		name: 'Time, Local Transaction',
		type: 'n'
	},
	'13': {
		length: 4,
		name: 'Date, Local Transaction',
		type: 'n'
	},
	'14': {
		length: 4,
		name: 'Date, Expiration',
		type: 'n'
	},
	'15': {
		length: 4,
		name: 'Date, Settlement',
		type: 'n'
	},
	'17' : {
		length: 4,
	    name: 'Date, Capture',
		type: 'n'
	},
	'18': {
		length: 4,
		name: 'Date, Settlement',
		type: 'n'
	},
	'22': {
		length: 3,
		name: 'Date, Settlement',
		type: 'n'
	},
	'24': {
		length: 3,
		name: 'Function Code',
		type: 'n'	
	},
	'25': {
		length: 2,
		name: 'Date, Settlement',
		type: 'n'
	},
	'32': {
		length: 11,
		name: 'Acquiring Institution Ident Code',
		type: 'llans'
	},
	'35': {
		length: 99,
		name: 'Track2Data',
		type: 'llans'
	},
	'37': {
		length: 12,
		name: 'Retrieval Reference Number',
		type: 'an'
	},
	'38': {
		length: 6,
		name: 'Authorization identification response',
		type: 'an'
	},
	'39': {
		length: 3,
		name: 'Response code',
		type: 'an'
	},
	'41': {
		length: 16,
		name: 'Card Acceptor Terminal Identification',
		type: 'ans'
	},
	'42': {
		length: 15,
		name: 'Card Acceptor Identification Code',
		type: 'ans'
	},
	'43': {
		length: 40,
		name: 'Card Acceptor Name/location',
		type: 'lln'
	},
	'44': {
		length: 6,
		name: 'Key Check Value',
		type: 'n'
	},
	'48': {
		length: 999,
		name: 'Customer Balance/Key',
		type: 'lllan'
	},
	'49': {
		length: 3,
		name: 'Currency code, transaction',
		type: 'an'
	},
	'52': {
		length: 16,
		name: 'PIN Data',
		type: 'an'
	},
	'54': {
		length: 999,
		name: 'Additional amounts',
		type: 'lllan'
	},
	'61': {
		length: 999,
		name: 'CBS terminalID And Customer Name',
		type: 'lllan'
	},
	'62': {
		length: 999,
		name: 'UIDAI Auth Code',
		type: 'lllan'
	},
	'63': {
		length: 999,
		name: 'Additional amounts',
		type: 'lllbinary'
	},
	'70': {
		length: 3,
		name: 'Network Management Information Code',
		type: 'n'
	},
	'90': {
		length: 42,
		name: 'Original Data Element',
		type: 'an'
	},
	'102': {
		length: 99,
		name: 'Private Field',
		type: 'llans'
	},
	'103': {
		length: 99,
		name: 'Private Field',
		type: 'llans'
	},
	'104': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'106': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'107': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'111': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'112': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'113': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'114': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'115': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'116': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'117': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'118': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'119': {
		length: 999,
		name: 'Encrypted Personal Identity Data',
		type: 'lllbinary'
	},
	'120': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'121': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'122': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'123': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'124': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'125': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'126': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	},
	'127': {
		length: 999,
		name: 'Private Field',
		type: 'lllbinary'
	},
	'128': {
		length: 999,
		name: 'Private Field',
		type: 'lllan'
	}
}
