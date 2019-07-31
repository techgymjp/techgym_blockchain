const fs = require("fs");
const sprintf = require('sprintf-js').sprintf;

function generateBuffer(index) {
	const buf = new Buffer(0x400);
	buf.fill(0);
	buf[0] = index;
	return buf;
}

if(!fs.existsSync("work"))
  fs.mkdirSync("work");

for(let i=0; i<256; i++) {
  fs.writeFile(sprintf("work/test%'03d.bin", i), generateBuffer(i), (err) => {
    if(err) throw err;
  });
}
