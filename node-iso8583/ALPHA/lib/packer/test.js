var lllan = require ('./lllan');
var n  = require ('./n');
var b  = require ('./b');
var packager = require ('../packager/client').packager;

var msg = Buffer.from ([0xf2, 0x18, 0x44, 0x81, 0x08, 0x60, 0x80, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x04]);
var result = b.unpack(msg, packager);
console.log (result);


